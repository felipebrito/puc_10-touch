import { motion } from 'framer-motion';
import { getCardLabelStyle } from '../utils/designUtils';
import './MenuGrid.css';

const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.07, delayChildren: 0.3 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, scale: 0.85, filter: 'blur(12px)' },
    visible: {
        opacity: 1,
        scale: 1,
        filter: 'blur(0px)',
        transition: { duration: 0.6, ease: 'easeOut' }
    }
};

export default function MenuGrid({ items, onItemClick, config, selectedCard, ignoreOverrides = false }) {
    const c = config?.grid || {};

    const gridStyle = {
        gap: `${c.gap ?? 11}px`,
        padding: `0 ${c.paddingHorizontal ?? 43}px`,
        gridTemplateColumns: `repeat(${c.columns ?? 3}, 1fr)`,
    };

    const cardBaseStyle = {
        border: `${c.cardBorderWidth ?? 3}px solid ${c.cardBorderColor ?? '#005fff'}`,
        borderRadius: `${c.cardBorderRadius ?? 6}px`,
    };

    const overlayStyle = {
        background: `linear-gradient(
            to top,
            rgba(0, 20, 60, ${c.overlayOpacity ?? 0.85}) 0%,
            rgba(0, 20, 60, ${(c.overlayOpacity ?? 0.85) * 0.3}) 45%,
            rgba(0, 20, 60, 0.02) 100%
        )`,
    };

    return (
        <motion.div
            className="menu-grid"
            style={gridStyle}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {items.map((item, index) => {
                const resolved = ignoreOverrides 
                    ? { ...c, labelBottom: c.labelBottom, labelLeft: c.labelLeft, labelRight: c.labelRight } 
                    : getCardLabelStyle(config, index);
                
                const labelStyle = {
                    position: 'absolute',
                    bottom: `${resolved.labelBottom}px`,
                    left: `${resolved.labelLeft}px`,
                    right: `${resolved.labelRight}px`,
                    fontSize: `${resolved.labelSize}px`,
                    letterSpacing: `${resolved.labelLetterSpacing}px`,
                    lineHeight: resolved.labelLineHeight,
                    textShadow: `0 2px ${resolved.labelShadowBlur}px rgba(0, 0, 0, 0.7)`,
                };

                const isSelected = selectedCard === index;
                const cardStyle = {
                    ...cardBaseStyle,
                    ...(isSelected ? { outline: '3px solid #ff9900', outlineOffset: '2px' } : {}),
                };

                return (
                    <motion.button
                        key={item.id}
                        className="menu-card"
                        style={cardStyle}
                        variants={itemVariants}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onItemClick?.(item)}
                        id={`menu-${item.id}`}
                    >
                        {/* Card number indicator */}
                        {selectedCard !== null && (
                            <span className="card-number">{index + 1}</span>
                        )}
                        <img
                            src={item.image}
                            alt={item.label}
                            className="menu-card-image"
                            loading="eager"
                        />
                        <div className="menu-card-overlay" style={overlayStyle} />
                        <span className="menu-card-label" style={labelStyle}>
                            {item.label.split('\n').map((line, i) => (
                                <span key={i}>
                                    {line}
                                    {i < item.label.split('\n').length - 1 && <br />}
                                </span>
                            ))}
                        </span>
                    </motion.button>
                );
            })}
        </motion.div>
    );
}
