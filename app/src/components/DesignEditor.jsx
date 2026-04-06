import { useState, useEffect, useCallback } from 'react';
import './DesignEditor.css';

const CARD_NAMES = [
    'O Perigo da Extinção', 'Boto', 'Toninha',
    'Baleia Jubarte', 'Baleia Franca', 'Tartarugas',
    'Peixe-Boi', 'Tubarões', 'Arraias',
];

const DEFAULT_CONFIG = {
    topBar: {
        height: 101,
        fontSize: 42,
        letterSpacing: 14,
        bgColor: '#005fff',
    },
    title: {
        paddingTop: 215,
        paddingLeft: 79,
        subtitleSize: 73,
        subtitleSpacing: 6.9,
        titleSize: 142,
        titleSpacing: 9.6,
        lineWidth: 320,
        lineHeight: 4,
        lineMarginTop: 34,
    },
    grid: {
        paddingTop: 130,
        paddingHorizontal: 43,
        gap: 11,
        columns: 3,
        cardBorderWidth: 3,
        cardBorderRadius: 6,
        cardBorderColor: '#005fff',
        labelSize: 30,
        labelBottom: 24,
        labelLeft: 21,
        labelRight: 21,
        labelLetterSpacing: 1.5,
        labelLineHeight: 1.1,
        labelShadowBlur: 6,
        overlayOpacity: 0.85,
    },
    bottomBar: {
        height: 64,
    },
    cardOverrides: {
        1: { labelBottom: 60, labelLeft: 16 },
        2: { labelBottom: 58 },
        3: { labelBottom: 41 },
        4: { labelRight: 21, labelSize: 30, labelBottom: 32 },
        5: { labelRight: 20, labelLeft: 27 },
        6: { labelBottom: 35, labelLeft: 21 },
        7: { labelBottom: 49 },
        8: { labelBottom: 50 },
    },
    // Species Page
    speciesPage: {
        heroHeight: 625,
        heroMarginBottom: 64,
        maskIntensity: 0,
        titleSize: 89,
        titleSpacing: 4,
        titleWeight: 900,
        titleLineHeight: 1.5,
        titleParenthesesSize: 61,
        subtitleSize: 53,
        subtitleSpacing: 2,
        subtitleLineHeight: 1.3,
        subtitleMarginTop: -21,
        scientificNameWeight: 400,
        scientificNameItalic: false,
        textSize: 40,
        textLineHeight: 1.1,
        paddingHorizontal: 75,
        paddingTop: 62,
        rowGap: 23,
        backButtonSize: 60,
        backButtonBottom: 39,
        backButtonLeft: 40,
        // White bar overlay
        whiteBarWidth: 375,
        whiteBarBottom: -7,
        whiteBarRight: 0,
        whiteBarOpacity: 1,
    },
};

function deepMerge(target, source) {
    const result = { ...target };
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
    const update = useCallback((section, key, value) => {
        setConfig(prev => {
            const next = { ...prev, [section]: { ...prev[section], [key]: value } };
            saveConfig(next);
            return next;
        });
    }, [setConfig]);

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

    const handleExport = () => {
        const json = JSON.stringify(config, null, 2);
        navigator.clipboard.writeText(json);
        alert('Config copiada para clipboard!');
    };

    const handleReset = () => {
        setConfig(DEFAULT_CONFIG);
        saveConfig(DEFAULT_CONFIG);
        setSelectedCard(null);
    };

    if (!visible) {
        return (
            <button className="editor-toggle" onClick={onToggle} title="Abrir Editor (⚙️)">
                ⚙️
            </button>
        );
    }

    const resolved = selectedCard !== null ? getCardLabelStyle(config, selectedCard) : null;
    const hasOverride = selectedCard !== null && config.cardOverrides?.[selectedCard];

    return (
        <div className="editor-panel">
            <div className="editor-header">
                <h3>🎨 Design Editor</h3>
                <div className="editor-header-actions">
                    <button onClick={handleExport} title="Exportar Config">📋</button>
                    <button onClick={handleReset} title="Reset">🔄</button>
                    <button onClick={onToggle}>✕</button>
                </div>
            </div>

            <div className="editor-body">
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

                {/* TOP BAR */}
                <ControlGroup label="🔵 Top Bar" defaultOpen={false}>
                    <Slider label="Altura" value={config.topBar.height} max={200}
                        onChange={v => update('topBar', 'height', v)} />
                    <Slider label="Font Size" value={config.topBar.fontSize} max={80}
                        onChange={v => update('topBar', 'fontSize', v)} />
                    <Slider label="Letter Spacing" value={config.topBar.letterSpacing} max={30}
                        onChange={v => update('topBar', 'letterSpacing', v)} />
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

                {/* BOTTOM BAR */}
                <ControlGroup label="⬇️ Bottom Bar" defaultOpen={false}>
                    <Slider label="Altura" value={config.bottomBar.height} max={200}
                        onChange={v => update('bottomBar', 'height', v)} />
                </ControlGroup>

                {/* SPECIES PAGE */}
                <ControlGroup label="🐋 Página de Espécie" defaultOpen={false}>
                    <Slider label="Hero Height" value={config.speciesPage.heroHeight} max={1000}
                        onChange={v => update('speciesPage', 'heroHeight', v)} />
                    <Slider label="Hero Margin Bottom" value={config.speciesPage.heroMarginBottom} min={-100} max={200}
                        onChange={v => update('speciesPage', 'heroMarginBottom', v)} />
                    <Slider label="Mask Intensity" value={config.speciesPage.maskIntensity} max={200}
                        onChange={v => update('speciesPage', 'maskIntensity', v)} />
                    <Slider label="Name Size" value={config.speciesPage.titleSize} max={120}
                        onChange={v => update('speciesPage', 'titleSize', v)} />
                    <Slider label="Name Weight" value={config.speciesPage.titleWeight} min={100} max={900} step={100}
                        onChange={v => update('speciesPage', 'titleWeight', v)} />
                    <Slider label="Name Line Height" value={config.speciesPage.titleLineHeight} max={2.5} step={0.1}
                        onChange={v => update('speciesPage', 'titleLineHeight', v)} />
                    <Slider label="Name (Parens) Size" value={config.speciesPage.titleParenthesesSize} max={120}
                        onChange={v => update('speciesPage', 'titleParenthesesSize', v)} />
                    <Slider label="Scientific Size" value={config.speciesPage.subtitleSize} max={100}
                        onChange={v => update('speciesPage', 'subtitleSize', v)} />
                    <Slider label="Scientific Weight" value={config.speciesPage.scientificNameWeight} min={100} max={900} step={100}
                        onChange={v => update('speciesPage', 'scientificNameWeight', v)} />
                    <Slider label="Scientific Line Height" value={config.speciesPage.subtitleLineHeight} max={2.5} step={0.1}
                        onChange={v => update('speciesPage', 'subtitleLineHeight', v)} />
                    <Slider label="Scientific Margin Top" value={config.speciesPage.subtitleMarginTop} min={-100} max={200}
                        onChange={v => update('speciesPage', 'subtitleMarginTop', v)} />
                    <Checkbox label="Scientific Italic" checked={config.speciesPage.scientificNameItalic}
                        onChange={v => update('speciesPage', 'scientificNameItalic', v)} />
                    <Slider label="Text Size" value={config.speciesPage.textSize} max={60}
                        onChange={v => update('speciesPage', 'textSize', v)} />
                    <Slider label="Text Line Height" value={config.speciesPage.textLineHeight} max={2.5} step={0.1}
                        onChange={v => update('speciesPage', 'textLineHeight', v)} />
                    <Slider label="Padding H" value={config.speciesPage.paddingHorizontal} max={200}
                        onChange={v => update('speciesPage', 'paddingHorizontal', v)} />
                    <Slider label="Padding T" value={config.speciesPage.paddingTop} max={200}
                        onChange={v => update('speciesPage', 'paddingTop', v)} />
                    <Slider label="Row Gap" value={config.speciesPage.rowGap} max={100}
                        onChange={v => update('speciesPage', 'rowGap', v)} />
                    <Slider label="Back Btn Bottom" value={config.speciesPage.backButtonBottom} max={200}
                        onChange={v => update('speciesPage', 'backButtonBottom', v)} />

                    {/* WHITE BAR OVERLAY CONTROLS */}
                    <ControlGroup label="⬜ Barra Branca" defaultOpen={true}>
                        <Slider label="Largura" value={config.speciesPage.whiteBarWidth} max={1080}
                            onChange={v => update('speciesPage', 'whiteBarWidth', v)} />
                        <Slider label="Bottom" value={config.speciesPage.whiteBarBottom} min={-200} max={200}
                            onChange={v => update('speciesPage', 'whiteBarBottom', v)} />
                        <Slider label="Right" value={config.speciesPage.whiteBarRight} min={-200} max={200}
                            onChange={v => update('speciesPage', 'whiteBarRight', v)} />
                        <Slider label="Opacidade" value={config.speciesPage.whiteBarOpacity} max={1} step={0.05}
                            onChange={v => update('speciesPage', 'whiteBarOpacity', v)} />
                    </ControlGroup>
                </ControlGroup>
            </div>
        </div>
    );
}

export { DEFAULT_CONFIG, loadConfig, saveConfig, getCardLabelStyle };
