import designConfig from '../data/designConfig.json';

export const DEFAULT_CONFIG = designConfig;

export function deepMerge(target, source) {
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

export function loadConfig() {
    try {
        const saved = localStorage.getItem('puc10-design-config');
        if (saved) {
            return deepMerge(DEFAULT_CONFIG, JSON.parse(saved));
        }
    } catch (e) { /* ignore */ }
    return DEFAULT_CONFIG;
}

export function saveConfig(config) {
    localStorage.setItem('puc10-design-config', JSON.stringify(config));
}

export function getCardLabelStyle(config, index) {
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
