import { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import designConfig from '../data/designConfig.json';
import './DesignEditor.css';

const CARD_NAMES = [
    'O Perigo da Extinção', 'Boto', 'Toninha',
    'Baleia Jubarte', 'Baleia Franca', 'Tartarugas',
    'Peixe-Boi', 'Tubarões', 'Arraias',
];

const DEFAULT_CONFIG = designConfig;

function deepMerge(target, source) {
    const result = { ...target };
    if (!source) return result;
    
    for (const key of Object.keys(source)) {
        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
            result[key] = deepMerge(target[key] || {}, source[key]);
        } else {
            result[key] = source[key];
        }
    }
    return result;
}

function loadConfig() {
    try {
        const saved = localStorage.getItem('puc10-design-config');
        if (saved) {
            return deepMerge(DEFAULT_CONFIG, JSON.parse(saved));
        }
    } catch (e) { /* ignore */ }
    return DEFAULT_CONFIG;
}

function saveConfig(config) {
    localStorage.setItem('puc10-design-config', JSON.stringify(config));
}

// Get resolved label style for a specific card index
function getCardLabelStyle(config, index) {
    const g = config.grid;
    const override = config.cardOverrides?.[index] || {};
    return {
        labelSize: override.labelSize ?? g.labelSize,
        labelBottom: override.labelBottom ?? g.labelBottom,
        labelLeft: override.labelLeft ?? g.labelLeft,
        labelRight: override.labelRight ?? g.labelRight,
        labelLetterSpacing: override.labelLetterSpacing ?? g.labelLetterSpacing,
        labelLineHeight: override.labelLineHeight ?? g.labelLineHeight,
        labelShadowBlur: override.labelShadowBlur ?? g.labelShadowBlur,
    };
}

function ControlGroup({ label, children, defaultOpen = true }) {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <div className="editor-group">
            <div className="editor-group-header" onClick={() => setOpen(!open)}>
                <span>{open ? '▼' : '▶'}</span>
                <span>{label}</span>
            </div>
            {open && <div className="editor-group-body">{children}</div>}
        </div>
    );
}

function Slider({ label, value, onChange, min = 0, max = 300, step = 1, unit = 'px' }) {
    return (
        <div className="editor-slider">
            <label>
                <span className="editor-slider-label">{label}</span>
                <span className="editor-slider-value">{value}{unit}</span>
            </label>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(parseFloat(e.target.value))}
            />
        </div>
    );
}

function ColorInput({ label, value, onChange }) {
    return (
        <div className="editor-color">
            <label>
                <span className="editor-slider-label">{label}</span>
                <input type="color" value={value} onChange={(e) => onChange(e.target.value)} />
                <span className="editor-slider-value">{value}</span>
            </label>
        </div>
    );
}

function Checkbox({ label, checked, onChange }) {
    return (
        <div className="editor-checkbox">
            <label>
                <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
                <span className="editor-slider-label">{label}</span>
            </label>
        </div>
    );
}

export default function DesignEditor({ config, setConfig, visible, onToggle, selectedCard, setSelectedCard }) {
    const location = useLocation();
    
    // Detect current species from URL
    const currentSpeciesId = useMemo(() => {
        const match = location.pathname.match(/^\/species\/(.+)$/);
        if (match) return match[1];
        return null;
    }, [location.pathname]);

    const hasSpeciesOverride = currentSpeciesId && !!config.speciesPageOverrides?.[currentSpeciesId];

    const update = useCallback((section, key, value) => {
        setConfig(prev => {
            const next = { ...prev };
            
            // If we are on a species page and editing "speciesPage" section
            if (section === 'speciesPage' && currentSpeciesId) {
                const overrides = { ...prev.speciesPageOverrides } || {};
                const currentOverride = overrides[currentSpeciesId] || {};
                
                // If species has an override, update the override
                if (overrides[currentSpeciesId]) {
                    overrides[currentSpeciesId] = { ...currentOverride, [key]: value };
                    next.speciesPageOverrides = overrides;
                } else {
                    // Otherwise update global
                    next[section] = { ...prev[section], [key]: value };
                }
            } else {
                // Standard global update
                next[section] = { ...prev[section], [key]: value };
            }

            saveConfig(next);
            return next;
        });
    }, [setConfig, currentSpeciesId]);

    const toggleSpeciesOverride = useCallback((enabled) => {
        if (!currentSpeciesId) return;
        
        setConfig(prev => {
            const next = { ...prev };
            const overrides = { ...prev.speciesPageOverrides } || {};
            
            if (enabled) {
                // Initialize override with current global values
                overrides[currentSpeciesId] = { ...prev.speciesPage };
            } else {
                // Remove override
                delete overrides[currentSpeciesId];
            }
            
            next.speciesPageOverrides = overrides;
            saveConfig(next);
            return next;
        });
    }, [setConfig, currentSpeciesId]);

    const updateCardOverride = useCallback((index, key, value) => {
        setConfig(prev => {
            const overrides = { ...prev.cardOverrides };
            overrides[index] = { ...(overrides[index] || {}), [key]: value };
            const next = { ...prev, cardOverrides: overrides };
            saveConfig(next);
            return next;
        });
    }, [setConfig]);

    const resetCardOverride = useCallback((index) => {
        setConfig(prev => {
            const overrides = { ...prev.cardOverrides };
            delete overrides[index];
            const next = { ...prev, cardOverrides: overrides };
            saveConfig(next);
            return next;
        });
    }, [setConfig]);

    // Keyboard: 1-9 to select card, 0 or Esc to deselect
    useEffect(() => {
        if (!visible) return;
        const handler = (e) => {
            const key = e.key;
            if (key >= '1' && key <= '9') {
                e.preventDefault();
                setSelectedCard(parseInt(key) - 1);
            } else if (key === '0' || key === 'Escape') {
                e.preventDefault();
                setSelectedCard(null);
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [visible, setSelectedCard]);

    // Global Key: C or P to toggle editor (anywhere)
    useEffect(() => {
        const handler = (e) => {
            const key = e.key.toLowerCase();
            if ((key === 'c' || key === 'p') && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
                e.preventDefault();
                onToggle();
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [onToggle]);

    const handleExport = () => {
        const json = JSON.stringify(config, null, 2);
        navigator.clipboard.writeText(json);
        alert('Config copiada para clipboard!');
    };

    const handleReset = () => {
        if (confirm('Deseja resetar para as configurações iniciais?')) {
            setConfig(DEFAULT_CONFIG);
            saveConfig(DEFAULT_CONFIG);
            setSelectedCard(null);
        }
    };

    const handleSaveToFile = async () => {
        try {
            const response = await fetch('/api/save-config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(config, null, 2)
            });
            if (response.ok) {
                alert('✅ Configurações salvas no arquivo designConfig.json!');
            } else {
                throw new Error('Erro ao salvar no servidor');
            }
        } catch (err) {
            console.error(err);
            alert('❌ Erro ao salvar arquivo. Verifique se o servidor está rodando.');
        }
    };

    if (!visible) {
        return null; // Don't expose the toggle button anymore
    }

    const resolved = selectedCard !== null ? getCardLabelStyle(config, selectedCard) : null;
    const hasOverride = selectedCard !== null && config.cardOverrides?.[selectedCard];

    return (
        <div className="editor-panel">
            <div className="editor-header">
                <h3>🎨 Design Editor</h3>
                <div className="editor-header-actions">
                    <button onClick={handleSaveToFile} title="Salvar no Arquivo (JSON)">💾</button>
                    <button onClick={handleExport} title="Exportar Config (Clipboard)">📋</button>
                    <button onClick={handleReset} title="Reset">🔄</button>
                    <button onClick={onToggle}>✕</button>
                </div>
            </div>

            <div className="editor-body">
                {/* HOME ONLY SECTIONS */}
                {location.pathname === '/' && (
                    <>
                        {/* CARD SELECTOR */}
                        <ControlGroup label={`🏷️ Card ${selectedCard !== null ? `#${selectedCard + 1}: ${CARD_NAMES[selectedCard]}` : '(nenhum — tecle 1-9)'}`}>
                            <div className="card-selector-grid">
                                {CARD_NAMES.map((name, i) => (
                                    <button
                                        key={i}
                                        className={`card-selector-btn ${selectedCard === i ? 'active' : ''} ${config.cardOverrides?.[i] ? 'has-override' : ''}`}
                                        onClick={() => setSelectedCard(selectedCard === i ? null : i)}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>

                            {selectedCard !== null && resolved && (
                                <>
                                    <div className="card-selected-info">
                                        <span>Editando: <strong>{CARD_NAMES[selectedCard]}</strong></span>
                                        {hasOverride && (
                                            <button className="card-reset-btn" onClick={() => resetCardOverride(selectedCard)}>
                                                Resetar para global
                                            </button>
                                        )}
                                    </div>
                                    <Slider label="Font Size" value={resolved.labelSize} max={60}
                                        onChange={v => updateCardOverride(selectedCard, 'labelSize', v)} />
                                    <Slider label="Bottom" value={resolved.labelBottom} max={80}
                                        onChange={v => updateCardOverride(selectedCard, 'labelBottom', v)} />
                                    <Slider label="Left" value={resolved.labelLeft} max={60}
                                        onChange={v => updateCardOverride(selectedCard, 'labelLeft', v)} />
                                    <Slider label="Right" value={resolved.labelRight} max={60}
                                        onChange={v => updateCardOverride(selectedCard, 'labelRight', v)} />
                                    <Slider label="Letter Spacing" value={resolved.labelLetterSpacing} max={8} step={0.1}
                                        onChange={v => updateCardOverride(selectedCard, 'labelLetterSpacing', v)} />
                                    <Slider label="Line Height" value={resolved.labelLineHeight} max={2} step={0.05}
                                        onChange={v => updateCardOverride(selectedCard, 'labelLineHeight', v)} />
                                    <Slider label="Shadow Blur" value={resolved.labelShadowBlur} max={20}
                                        onChange={v => updateCardOverride(selectedCard, 'labelShadowBlur', v)} />
                                </>
                            )}
                        </ControlGroup>

                        {/* GLOBAL LABEL DEFAULTS */}
                        <ControlGroup label="🏷️ Labels (Global)" defaultOpen={false}>
                            <Slider label="Font Size" value={config.grid.labelSize} max={60}
                                onChange={v => update('grid', 'labelSize', v)} />
                            <Slider label="Bottom" value={config.grid.labelBottom} max={80}
                                onChange={v => update('grid', 'labelBottom', v)} />
                            <Slider label="Left" value={config.grid.labelLeft} max={60}
                                onChange={v => update('grid', 'labelLeft', v)} />
                            <Slider label="Right" value={config.grid.labelRight} max={60}
                                onChange={v => update('grid', 'labelRight', v)} />
                            <Slider label="Letter Spacing" value={config.grid.labelLetterSpacing} max={8} step={0.1}
                                onChange={v => update('grid', 'labelLetterSpacing', v)} />
                            <Slider label="Line Height" value={config.grid.labelLineHeight} max={2} step={0.05}
                                onChange={v => update('grid', 'labelLineHeight', v)} />
                            <Slider label="Shadow Blur" value={config.grid.labelShadowBlur} max={20}
                                onChange={v => update('grid', 'labelShadowBlur', v)} />
                        </ControlGroup>

                        {/* TITLE */}
                        <ControlGroup label="📝 Título" defaultOpen={false}>
                            <Slider label="Padding Top" value={config.title.paddingTop} max={400}
                                onChange={v => update('title', 'paddingTop', v)} />
                            <Slider label="Padding Left" value={config.title.paddingLeft} max={200}
                                onChange={v => update('title', 'paddingLeft', v)} />
                            <Slider label="Subtítulo Size" value={config.title.subtitleSize} max={150}
                                onChange={v => update('title', 'subtitleSize', v)} />
                            <Slider label="Subtítulo Spacing" value={config.title.subtitleSpacing} max={20} step={0.1}
                                onChange={v => update('title', 'subtitleSpacing', v)} />
                            <Slider label="Título Size" value={config.title.titleSize} max={200}
                                onChange={v => update('title', 'titleSize', v)} />
                            <Slider label="Título Spacing" value={config.title.titleSpacing} max={20} step={0.1}
                                onChange={v => update('title', 'titleSpacing', v)} />
                            <Slider label="Linha Width" value={config.title.lineWidth} max={1080}
                                onChange={v => update('title', 'lineWidth', v)} />
                            <Slider label="Linha Height" value={config.title.lineHeight} max={10} step={0.5}
                                onChange={v => update('title', 'lineHeight', v)} />
                            <Slider label="Linha Margin Top" value={config.title.lineMarginTop} max={60}
                                onChange={v => update('title', 'lineMarginTop', v)} />
                            <Slider label="Desc. Size" value={config.title.descriptionSize || 32} max={100}
                                onChange={v => update('title', 'descriptionSize', v)} />
                            <Slider label="Desc. Spacing" value={config.title.descriptionSpacing || 1.5} max={20} step={0.1}
                                onChange={v => update('title', 'descriptionSpacing', v)} />
                            <Slider label="Desc. Margin Top" value={config.title.descriptionMarginTop || 45} max={200}
                                onChange={v => update('title', 'descriptionMarginTop', v)} />
                            <Slider label="Desc. Weight" value={config.title.descriptionWeight || 300} min={100} max={900} step={100}
                                onChange={v => update('title', 'descriptionWeight', v)} />
                        </ControlGroup>

                        {/* GRID */}
                        <ControlGroup label="📦 Grid Menu" defaultOpen={false}>
                            <Slider label="Padding Top" value={config.grid.paddingTop} max={200}
                                onChange={v => update('grid', 'paddingTop', v)} />
                            <Slider label="Padding H" value={config.grid.paddingHorizontal} max={200}
                                onChange={v => update('grid', 'paddingHorizontal', v)} />
                            <Slider label="Gap" value={config.grid.gap} max={60}
                                onChange={v => update('grid', 'gap', v)} />
                            <Slider label="Border Width" value={config.grid.cardBorderWidth} max={10} step={0.5}
                                onChange={v => update('grid', 'cardBorderWidth', v)} />
                            <Slider label="Border Radius" value={config.grid.cardBorderRadius} max={30}
                                onChange={v => update('grid', 'cardBorderRadius', v)} />
                            <ColorInput label="Border Color" value={config.grid.cardBorderColor}
                                onChange={v => update('grid', 'cardBorderColor', v)} />
                            <Slider label="Overlay Opacity" value={config.grid.overlayOpacity} max={1} step={0.05}
                                onChange={v => update('grid', 'overlayOpacity', v)} />
                        </ControlGroup>
                    </>
                )}

                {/* SPECIES PAGE SECTIONS */}
                {currentSpeciesId && currentSpeciesId !== 'perigo-extincao' && (
                    <>
                        {(() => {
                            const sp = hasSpeciesOverride ? config.speciesPageOverrides[currentSpeciesId] : config.speciesPage;
                            return (
                                <ControlGroup label="🐋 Página da Espécie" defaultOpen={true}>
                                    <div className="editor-species-override">
                                        <Checkbox 
                                            label={`Sobrescrever Estilo (${currentSpeciesId.toUpperCase()})`}
                                            checked={hasSpeciesOverride}
                                            onChange={toggleSpeciesOverride}
                                        />
                                        {hasSpeciesOverride && (
                                            <p style={{ fontSize: '11px', color: '#005fff', marginTop: '-8px', marginBottom: '15px' }}>
                                                ✓ Editando apenas esta espécie.
                                            </p>
                                        )}
                                    </div>
                                    
                                    <Slider label="Hero Height" value={sp.heroHeight} max={1000}
                                        onChange={v => update('speciesPage', 'heroHeight', v)} />
                                    <Slider label="Hero Margin Bottom" value={sp.heroMarginBottom} min={-100} max={200}
                                        onChange={v => update('speciesPage', 'heroMarginBottom', v)} />
                                    <Slider label="Mask Intensity" value={sp.maskIntensity} max={200}
                                        onChange={v => update('speciesPage', 'maskIntensity', v)} />
                                    <Slider label="Name Size" value={sp.titleSize} max={120}
                                        onChange={v => update('speciesPage', 'titleSize', v)} />
                                    <Slider label="Name Weight" value={sp.titleWeight} min={100} max={900} step={100}
                                        onChange={v => update('speciesPage', 'titleWeight', v)} />
                                    <Slider label="Name Line Height" value={sp.titleLineHeight} max={2.5} step={0.1}
                                        onChange={v => update('speciesPage', 'titleLineHeight', v)} />
                                    <Slider label="Name (Parens) Size" value={sp.titleParenthesesSize} max={120}
                                        onChange={v => update('speciesPage', 'titleParenthesesSize', v)} />
                                    <Slider label="Scientific Size" value={sp.subtitleSize} max={100}
                                        onChange={v => update('speciesPage', 'subtitleSize', v)} />
                                    <Slider label="Scientific Spacing" value={sp.subtitleSpacing} max={20} step={0.1}
                                        onChange={v => update('speciesPage', 'subtitleSpacing', v)} />
                                    <Slider label="Scientific Line Height" value={sp.subtitleLineHeight} max={2.5} step={0.1}
                                        onChange={v => update('speciesPage', 'subtitleLineHeight', v)} />
                                    <Slider label="Scientific Margin Top" value={sp.subtitleMarginTop} min={-100} max={100}
                                        onChange={v => update('speciesPage', 'subtitleMarginTop', v)} />
                                    <Slider label="Scientific Weight" value={sp.scientificNameWeight} min={100} max={900} step={100}
                                        onChange={v => update('speciesPage', 'scientificNameWeight', v)} />
                                    <Checkbox label="Scientific Italic" checked={sp.scientificNameItalic}
                                        onChange={v => update('speciesPage', 'scientificNameItalic', v)} />
                                    
                                    <Slider label="Text Size" value={sp.textSize} max={60}
                                        onChange={v => update('speciesPage', 'textSize', v)} />
                                    <Slider label="Text Line Height" value={sp.textLineHeight} max={2.5} step={0.1}
                                        onChange={v => update('speciesPage', 'textLineHeight', v)} />
                                    
                                    <Slider label="Padding Horizontal" value={sp.paddingHorizontal} max={200}
                                        onChange={v => update('speciesPage', 'paddingHorizontal', v)} />
                                    <Slider label="Padding Top" value={sp.paddingTop} max={400}
                                        onChange={v => update('speciesPage', 'paddingTop', v)} />
                                    <Slider label="Row Gap" value={sp.rowGap} max={100}
                                        onChange={v => update('speciesPage', 'rowGap', v)} />
                                    
                                    <ControlGroup label="⬅️ Botão Voltar" defaultOpen={false}>
                                        <Slider label="Tamanho" value={sp.backButtonSize} max={150}
                                            onChange={v => update('speciesPage', 'backButtonSize', v)} />
                                        <Slider label="Posição Bottom" value={sp.backButtonBottom} max={200}
                                            onChange={v => update('speciesPage', 'backButtonBottom', v)} />
                                        <Slider label="Posição Left" value={sp.backButtonLeft} max={200}
                                            onChange={v => update('speciesPage', 'backButtonLeft', v)} />
                                    </ControlGroup>

                                    <ControlGroup label="⬜ Barra Branca" defaultOpen={false}>
                                        <Slider label="Largura" value={sp.whiteBarWidth} max={1080}
                                            onChange={v => update('speciesPage', 'whiteBarWidth', v)} />
                                        <Slider label="Posição Bottom" value={sp.whiteBarBottom} min={-200} max={200}
                                            onChange={v => update('speciesPage', 'whiteBarBottom', v)} />
                                        <Slider label="Transparência" value={sp.whiteBarOpacity} max={1} step={0.05}
                                            onChange={v => update('speciesPage', 'whiteBarOpacity', v)} />
                                    </ControlGroup>

                                    <ControlGroup label="🔗 Endereço do Site" defaultOpen={true}>
                                        <Slider label="Tamanho Fonte" value={sp.footerUrlSize} max={100}
                                            onChange={v => update('speciesPage', 'footerUrlSize', v)} />
                                        <Slider label="Espaçamento Letra" value={sp.footerUrlSpacing} min={-5} max={20}
                                            onChange={v => update('speciesPage', 'footerUrlSpacing', v)} />
                                        <Slider label="Peso Fonte" value={sp.footerUrlWeight} min={100} max={900} step={100}
                                            onChange={v => update('speciesPage', 'footerUrlWeight', v)} />
                                        <Slider label="Margem Esquerda" value={sp.footerUrlMarginLeft} max={200}
                                            onChange={v => update('speciesPage', 'footerUrlMarginLeft', v)} />
                                        <Slider label="Descer URL (Padding Top)" value={sp.footerUrlPaddingTop} max={300}
                                            onChange={v => update('speciesPage', 'footerUrlPaddingTop', v)} />
                                        <Slider label="Respiro/Gap (URL -> Linha)" value={sp.footerUrlMarginBottom} min={-300} max={300}
                                            onChange={v => update('speciesPage', 'footerUrlMarginBottom', v)} />
                                        
                                        <Slider label="Eixo Vertical Rodapé (Subir/Descer)" value={sp.footerVerticalOffset} min={-1000} max={1000}
                                            onChange={v => update('speciesPage', 'footerVerticalOffset', v)} />
                                        <p style={{ fontSize: '11px', color: '#888', marginTop: '-8px', marginLeft: '12px' }}>
                                            (Valores Negativos = Descer | Positivos = Subir)
                                        </p>
                                        
                                        <button 
                                            onClick={() => {
                                                update('speciesPage', 'footerVerticalOffset', 0);
                                                update('speciesPage', 'footerUrlMarginBottom', 32);
                                            }}
                                            style={{ margin: '10px 12px', padding: '4px 8px', fontSize: '12px' }}
                                        >
                                            Resetar Rodapé (0)
                                        </button>
                                    
                                        <div className="editor-row">
                                            <label>Cor do Link</label>
                                            <input 
                                                type="color" 
                                                value={sp.footerUrlColor} 
                                                onChange={e => update('speciesPage', 'footerUrlColor', e.target.value)} 
                                            />
                                        </div>
                                    </ControlGroup>
                                </ControlGroup>
                            );
                        })()}
                    </>
                )}

                {/* EXTINCTION PAGE SECTIONS */}
                {currentSpeciesId === 'perigo-extincao' && (
                    <ControlGroup label="💀 Página Extinção" defaultOpen={true}>
                        <div className="slide-selector" style={{ display: 'flex', gap: '5px', marginBottom: '20px', padding: '0 10px' }}>
                            {[1, 2, 3, 4, 5, 6, 7].map(num => (
                                <button
                                    key={num}
                                    onClick={() => {
                                        window.dispatchEvent(new CustomEvent('goto-slide', { detail: num - 1 }));
                                    }}
                                    style={{
                                        flex: 1,
                                        padding: '8px 0',
                                        background: '#222',
                                        border: '1px solid #444',
                                        color: '#fff',
                                        borderRadius: '4px',
                                        fontSize: '11px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    S{num}
                                </button>
                            ))}
                        </div>

                        <Slider label="Padding Top" value={config.extincaoPage?.paddingTop} max={600}
                            onChange={v => update('extincaoPage', 'paddingTop', v)} />
                        <Slider label="Padding Left" value={config.extincaoPage?.paddingLeft} max={400}
                            onChange={v => update('extincaoPage', 'paddingLeft', v)} />
                        
                        <ControlGroup label="📝 Títulos" defaultOpen={true}>
                            <Slider label="Subtítulo Size" value={config.extincaoPage?.subtitleSize} max={150}
                                onChange={v => update('extincaoPage', 'subtitleSize', v)} />
                            <Slider label="Subtítulo Spacing" value={config.extincaoPage?.subtitleSpacing} max={40} step={0.1}
                                onChange={v => update('extincaoPage', 'subtitleSpacing', v)} />
                            <Slider label="Subtítulo Weight" value={config.extincaoPage?.subtitleWeight} min={100} max={900} step={100}
                                onChange={v => update('extincaoPage', 'subtitleWeight', v)} />
                            <Slider label="Subtítulo Line Height" value={config.extincaoPage?.subtitleLineHeight} min={0.5} max={3} step={0.05}
                                onChange={v => update('extincaoPage', 'subtitleLineHeight', v)} />
                            <Slider label="Subtítulo Width" value={config.extincaoPage?.subtitleWidth} max={1080}
                                onChange={v => update('extincaoPage', 'subtitleWidth', v)} />
                            <Slider label="Subtítulo Margin Top" value={config.extincaoPage?.subtitleMarginTop} max={200}
                                onChange={v => update('extincaoPage', 'subtitleMarginTop', v)} />

                            <Slider label="Título Size" value={config.extincaoPage?.titleSize} max={200}
                                onChange={v => update('extincaoPage', 'titleSize', v)} />
                            <Slider label="Título Spacing" value={config.extincaoPage?.titleSpacing} max={40} step={0.1}
                                onChange={v => update('extincaoPage', 'titleSpacing', v)} />
                            <Slider label="Título Weight" value={config.extincaoPage?.titleWeight} min={100} max={900} step={100}
                                onChange={v => update('extincaoPage', 'titleWeight', v)} />
                            <Slider label="Título Line Height" value={config.extincaoPage?.titleLineHeight} min={0.5} max={3} step={0.05}
                                onChange={v => update('extincaoPage', 'titleLineHeight', v)} />
                            <Slider label="Título Width" value={config.extincaoPage?.titleWidth} max={1080}
                                onChange={v => update('extincaoPage', 'titleWidth', v)} />
                            <Slider label="Título Margin Top" value={config.extincaoPage?.titleMarginTop} max={200}
                                onChange={v => update('extincaoPage', 'titleMarginTop', v)} />

                            <Slider label="Linha Width" value={config.extincaoPage?.lineWidth} max={1080}
                                onChange={v => update('extincaoPage', 'lineWidth', v)} />
                            <Slider label="Linha Height" value={config.extincaoPage?.lineHeight} max={20} step={0.5}
                                onChange={v => update('extincaoPage', 'lineHeight', v)} />
                            <Slider label="Linha Margin Top" value={config.extincaoPage?.lineMarginTop} max={100}
                                onChange={v => update('extincaoPage', 'lineMarginTop', v)} />
                        </ControlGroup>

                        <ControlGroup label="📄 Texto" defaultOpen={true}>
                            <Slider label="Largura" value={config.extincaoPage?.textWidth} max={1080}
                                onChange={v => update('extincaoPage', 'textWidth', v)} />
                            <Slider label="Tamanho Fonte" value={config.extincaoPage?.textSize} max={100}
                                onChange={v => update('extincaoPage', 'textSize', v)} />
                            <Slider label="Line Height" value={config.extincaoPage?.textLineHeight} max={3} step={0.05}
                                onChange={v => update('extincaoPage', 'textLineHeight', v)} />
                            <Slider label="Margin Top" value={config.extincaoPage?.textMarginTop} max={300}
                                onChange={v => update('extincaoPage', 'textMarginTop', v)} />
                            <Slider label="Weight" value={config.extincaoPage?.textWeight} min={100} max={900} step={100}
                                onChange={v => update('extincaoPage', 'textWeight', v)} />
                        </ControlGroup>

                        <ControlGroup label="🛡️ Selos (Slide 3)" defaultOpen={false}>
                            <Slider label="Largura Selos" value={config.extincaoPage?.sealsWidth} max={1000}
                                onChange={v => update('extincaoPage', 'sealsWidth', v)} />
                            <Slider label="Margem Top" value={config.extincaoPage?.sealsMarginTop} max={300}
                                onChange={v => update('extincaoPage', 'sealsMarginTop', v)} />
                        </ControlGroup>
                    </ControlGroup>
                )}

                {/* ALWAYS VISIBLE GLOBAL SECTIONS */}
                <ControlGroup label="🔵 Top Bar" defaultOpen={false}>
                    <Slider label="Altura" value={config.topBar.height} max={200}
                        onChange={v => update('topBar', 'height', v)} />
                    <Slider label="Font Size" value={config.topBar.fontSize} max={80}
                        onChange={v => update('topBar', 'fontSize', v)} />
                    <Slider label="Letter Spacing" value={config.topBar.letterSpacing} max={30}
                        onChange={v => update('topBar', 'letterSpacing', v)} />
                </ControlGroup>

                <ControlGroup label="⬇️ Bottom Bar" defaultOpen={false}>
                    <Slider label="Altura" value={config.bottomBar.height} max={200}
                        onChange={v => update('bottomBar', 'height', v)} />
                </ControlGroup>
            </div>
        </div>
    );
}

export { DEFAULT_CONFIG, loadConfig, saveConfig, getCardLabelStyle };
