import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { menuItems, speciesDetails } from '../data/menuItems';
import TopBar from '../components/TopBar';
import './SpeciesDetail.css';

export default function SpeciesDetail({ config, setConfig, editorVisible, onToggleEditor }) {
    const { id } = useParams();
    // Procura no menu principal ou nos detalhes específicos de sub-páginas
    const species = menuItems.find(item => item.id === id) || speciesDetails[id];

    // Merge global speciesPage config with any specific override for this ID
    const sp = {
        ...config.speciesPage,
        ...(config.speciesPageOverrides?.[id] || {})
    };

    if (!species) return <div className="error">Espécie não encontrada</div>;

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
        visible: {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            transition: { duration: 0.6, ease: "easeOut" }
        }
    };

    const heroVariants = {
        hidden: { opacity: 0, filter: 'blur(15px)' },
        visible: {
            opacity: 1,
            filter: 'blur(0px)',
            transition: { duration: 0.8, ease: "easeOut" }
        }
    };

    const backInfo = (() => {
        const sharkIds = ['tubarao-mangona', 'tubarao-martelo', 'cacao-anjo'];
        const rayIds = ['raia-jamanta'];

        if (sharkIds.includes(id)) return { path: '/species/tubaroes', label: 'Tubarões' };
        if (rayIds.includes(id)) return { path: '/species/arraias', label: 'Arraias' };
        return null;
    })();

    // Helper para formatar texto (negrito e itálico)
    const renderText = (text) => ({
        __html: text
            .replace(/\*\*(.*?)\*\*/g, `<strong style="font-weight:bold;">$1</strong>`)
            .replace(/_(.*?)_/g, `<em style="font-style:italic;">$1</em>`)
    });

    return (
        <div className="species-detail-wrapper">
            <div className="detail-navigation">
                <Link to="/" className="back-button-home" style={{
                    width: `${sp.backButtonSize}px`,
                    height: `${sp.backButtonSize}px`,
                }}>
                    <img src="/assets/images/home.svg" alt="Home" className="home-icon-svg" />
                </Link>

                {backInfo && (
                    <Link to={backInfo.path} className="back-button-category">
                        {backInfo.label}
                    </Link>
                )}
            </div>

        <motion.div
            className="species-detail"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <TopBar />


            <div className="species-hero" style={{ height: `${sp.heroHeight}px`, marginBottom: `${sp.heroMarginBottom ?? 40}px` }}>
                <motion.div
                    className="hero-image-container"
                    variants={heroVariants}
                    style={{
                        clipPath: `polygon(0 0, 100% 0, 100% 100%, ${sp.maskIntensity}px 100%)`
                    }}
                >
                    <img src={species.heroImage || species.image} alt={species.label} className="hero-image" />
                </motion.div>

                {/* White Bar Overlay - Static (no animation) */}
                <img
                    src="/assets/barrabranca.png"
                    alt=""
                    className="hero-white-bar"
                    style={{
                        position: 'absolute',
                        bottom: `${sp.whiteBarBottom}px`,
                        right: `${sp.whiteBarRight}px`,
                        width: `${sp.whiteBarWidth}px`,
                        opacity: sp.whiteBarOpacity,
                        pointerEvents: 'none',
                        zIndex: 10
                    }}
                />
            </div>

            <motion.div
                className="species-content"
                style={{
                    padding: `${sp.paddingTop}px ${sp.paddingHorizontal}px`,
                    gap: `${sp.rowGap}px`
                }}
            >
                <div className="species-titles">
                    <motion.h1
                        className="species-name"
                        style={{
                            fontSize: `${sp.titleSize}px`,
                            letterSpacing: `${sp.titleSpacing}px`,
                            fontWeight: sp.titleWeight,
                            lineHeight: sp.titleLineHeight,
                            display: 'flex',
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            alignItems: 'baseline',
                            gap: '15px'
                        }}
                        variants={itemVariants}
                    >
                        {(() => {
                            const name = species.scientificName || species.label;
                            const match = name.match(/^(.*?)(\s*\(.*?\))\s*$/);
                            if (match) {
                                return (
                                    <>
                                        <span className="name-main">{match[1].trim()}</span>
                                        <span
                                            className="name-parens"
                                            style={{
                                                fontSize: `${sp.titleParenthesesSize || (sp.titleSize * 0.5)}px`
                                            }}
                                        >
                                            {match[2].trim()}
                                        </span>
                                    </>
                                );
                            }
                            return name;
                        })()}
                    </motion.h1>
                    <motion.h2
                        className="species-binomial"
                        style={{
                            fontSize: `${sp.subtitleSize}px`,
                            letterSpacing: `${sp.subtitleSpacing}px`,
                            fontWeight: sp.scientificNameWeight,
                            lineHeight: sp.subtitleLineHeight,
                            marginTop: `${sp.subtitleMarginTop}px`,
                            textTransform: 'none',
                            fontStyle: 'italic'
                        }}
                        variants={itemVariants}
                    >
                        {species.binomialName}
                    </motion.h2>
                </div>

                <motion.div
                    className="species-description"
                    style={{
                        fontSize: `${sp.textSize}px`,
                        lineHeight: sp.textLineHeight,
                        maxWidth: `${sp.textMaxWidth ?? 800}px`
                    }}
                    variants={itemVariants}
                >
                    {species.description?.split('\n\n').map((para, i) => (
                        <p key={i} dangerouslySetInnerHTML={renderText(para)} />
                    )) || <p>Descrição em breve...</p>}
                </motion.div>

            </motion.div>

            {/* Final Footer Image Page */}
            <div className="species-final-footer" style={{
                pointerEvents: 'auto',
                marginTop: 'auto',
                width: '100%',
                zIndex: 10,
                transform: `translate(${sp.footerHorizontalOffset ?? 0}px, ${- (sp.footerVerticalOffset ?? 0)}px) scale(${sp.footerScale ?? 1})`,
                transformOrigin: 'bottom left'
            }}>
                {species.externalUrl && (
                    <div className="species-footer">
                        <div className="footer-url-container" style={{
                            paddingLeft: `${sp.footerUrlMarginLeft}px`,
                            paddingTop: `${sp.footerUrlPaddingTop ?? 0}px`,
                            marginBottom: `${sp.footerUrlMarginBottom ?? 0}px`
                        }}>
                            <span className="footer-url" style={{
                                fontSize: `${sp.footerUrlSize}px`,
                                letterSpacing: `${sp.footerUrlSpacing}px`,
                                fontWeight: sp.footerUrlWeight,
                                color: sp.footerUrlColor
                            }}>
                                {species.externalUrl}
                            </span>
                        </div>
                    </div>
                )}
                {!species.footerImage && (
                    <img
                        src="/assets/linha.svg"
                        alt=""
                        className="footer-line-separator"
                    />
                )}
                <img src={species.footerImage || "/assets/rodape.png"} alt="" className="rodape-image" />
            </div>

        </motion.div>
        </div>
    );
}
