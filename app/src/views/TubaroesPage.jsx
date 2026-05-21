import { useState, useRef, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import TopBar from '../components/TopBar';
import './TubaroesPage.css';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    },
    exit: {
        opacity: 0,
        transition: { staggerChildren: 0.05, staggerDirection: -1 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20, filter: 'blur(10px)' },
    visible: {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        transition: { duration: 0.6, ease: 'easeOut' }
    },
    exit: {
        opacity: 0,
        y: -20,
        filter: 'blur(10px)',
        transition: { duration: 0.4, ease: 'easeIn' }
    }
};

const slides = [
    {
        type: 'shark-text',
        title: 'TUBARÕES E RAIAS\nAMEAÇADOS DE EXTINÇÃO NO BRASIL',
        background: '/assets/images/tubaroes/slide1_bg.png',
        guideImage: '/assets/guides/revisao-22-04/page-21.jpg',
        paragraphs: [
            'Os elasmobrânquios, grupo de animais em que estão inseridos os tubarões e raias, são geralmente capturados de forma acidental na pesca dirigida para espécies de peixes ósseos de alto valor comercial, como atuns, pescadas, tainhas etc.',
            'Atualmente, diversas espécies de tubarões e raias sofrem com reduções significativas em suas populações, incluindo algumas espécies já consideradas extintas ou em vias de extinção.'
        ],
    },
    {
        type: 'shark-text',
        background: '/assets/images/tubaroes/slide2_bg.png',
        guideImage: '/assets/guides/revisao-22-04/page-22.jpg',
        paragraphs: [
            'A principal ameaça aos tubarões e raias é a perda de habitat, principalmente nas áreas costeiras e praias, devido à urbanização descontrolada e atividades industriais, tais como portos e dragagens em zonas de estuários, que alteram ou destroem as áreas de reprodução, alimentação e abrigo.',
            'As mudanças climáticas, que têm aumentado as temperaturas e a acidificação dos oceanos, alteram as cadeias alimentares e a distribuição das espécies, ampliando seu risco de extinção. Confira a seguir detalhes sobre algumas dessas espécies:'
        ],
    },
    {
        type: 'species-detail',
        id: 'tubarao-mangona',
        label: 'TUBARÃO-MANGONA',
        scientificName: 'TUBARÃO-MANGONA',
        binomialName: 'Carcharias taurus',
        heroImage: '/assets/images/tubaroes/mangona_hero.png',
        footerImage: '/assets/images/tubaroes/mangona_footer.png',
        guideImage: '/assets/guides/revisao-22-04/page-23.jpg',
        paragraphs: [
            'É um tubarão de grande porte, com distribuição costeira no mundo inteiro. No Brasil, ocorre no Sudeste e Sul. O comprimento máximo comprovado da espécie é de aproximadamente 3,2 m, chegando a pesar por volta de 300 kg.',
            'Tem apenas dois filhotes por gestação. Como resultado, as taxas anuais de crescimento da população são muito baixas, reduzindo sua capacidade de sustentar as ameaças causadas pela pesca.'
        ],
    },
    {
        type: 'species-detail',
        id: 'tubarao-martelo',
        label: 'TUBARÃO-MARTELO-GRANDE',
        scientificName: 'TUBARÃO-MARTELO-GRANDE',
        binomialName: 'Sphyrna mokarran',
        heroImage: '/assets/images/tubaroes/martelo_hero.png',
        footerImage: '/assets/images/tubaroes/martelo_footer.png',
        guideImage: '/assets/guides/revisao-22-04/page-24.jpg',
        paragraphs: [
            'Podendo ultrapassar os 6 m de comprimento, é um grande tubarão tropical e sub-tropical, amplamente distribuído.',
            'Altamente valorizado por suas barbatanas, apresenta taxas elevadas de mortalidade e se reproduz apenas uma vez a cada dois anos, tornando-se vulnerável à sobre-exploração e redução da população.'
        ],
    },
    {
        type: 'species-detail',
        id: 'cacao-anjo',
        label: 'CAÇÃO-ANJO-DE-ASA-LONGA',
        scientificName: 'CAÇÃO-ANJO-DE-ASA-LONGA',
        binomialName: 'Squatina argentina',
        heroImage: '/assets/images/tubaroes/cacao_anjo_hero.png',
        footerImage: '/assets/images/tubaroes/cacao_anjo_footer.png',
        guideImage: '/assets/guides/revisao-22-04/page-25.jpg',
        paragraphs: [
            'Também conhecido como tubarão-anjo-argentino, é uma espécie de peixe cartilaginoso, com um comprimento máximo de 1,4 m, endêmica do Atlântico Sul ocidental. No Brasil, há registros da espécie desde o Rio de Janeiro até o Rio Grande do Sul. As pescarias com redes de arrasto e emalhe são a principal ameaça sobre a espécie. O cação-anjo-de-asa-longa apresenta longa vida e baixo potencial reprodutivo.',
        ],
    },
];

export default function TubaroesPage({ config }) {
    const [current, setCurrent] = useState(0);
    const [searchParams] = useSearchParams();
    const dragStart = useRef(null);
    const isDragging = useRef(false);

    // Support direct slide navigation via URL (?slide=3 for the 3rd slide)
    useEffect(() => {
        const slideParam = searchParams.get('slide');
        if (slideParam !== null) {
            // Subtract 1 because the URL uses 1-based indexing, but array is 0-based
            const index = parseInt(slideParam) - 1;
            if (!isNaN(index) && index >= 0 && index < slides.length) {
                setCurrent(index);
            }
        }
    }, [searchParams]);

    const currentSlide = slides[current];

    // Expose current slide to the global editor
    useEffect(() => {
        window.__currentSlideIndex = current;
        window.__currentSpeciesId = currentSlide.type === 'species-detail' ? currentSlide.id : 'tubaroes';
        window.dispatchEvent(new CustomEvent('slide-changed'));
        return () => {
            window.__currentSlideIndex = undefined;
            window.__currentSpeciesId = undefined;
            window.dispatchEvent(new CustomEvent('slide-changed'));
        };
    }, [current, currentSlide]);

    // Resolve design configuration
    const speciesId = 'tubaroes';
    const overrides = config?.speciesPageOverrides?.[speciesId] || {};

    const specificSpeciesId = currentSlide.type === 'species-detail' ? currentSlide.id : null;
    const specificOverrides = specificSpeciesId ? (config?.speciesPageOverrides?.[specificSpeciesId] || {}) : {};

    const sp = {
        ...config.speciesPage,
        ...overrides,
        ...(overrides.slideOverrides?.[current] || {}),
        ...specificOverrides
        // Removed specificOverrides.slideOverrides because specific species do not have sub-slides,
        // and legacy ghost data might be overriding the correct scale value.
    };

    // Debug log to see if sp updates when sliders move
    useEffect(() => {
        if (window.__designEditorVisible) {
            console.log(`[TubaroesPage] sp updated for ${specificSpeciesId || 'global'}:`, sp);
        }
    }, [sp, specificSpeciesId]);

    const goTo = (index) => {
        if (index >= 0 && index < slides.length) setCurrent(index);
    };

    const handlePointerDown = (e) => {
        dragStart.current = e.clientX;
        isDragging.current = true;
    };

    const handlePointerUp = (e) => {
        if (!isDragging.current || dragStart.current === null) return;
        isDragging.current = false;
        const delta = dragStart.current - e.clientX;
        if (delta > 60) goTo(current + 1);
        else if (delta < -60) goTo(current - 1);
        dragStart.current = null;
    };

    const handlePointerCancel = () => {
        isDragging.current = false;
        dragStart.current = null;
    };

    const backButtonStyle = {
        width: `${sp.backButtonSize ?? 60}px`,
        height: `${sp.backButtonSize ?? 60}px`,
        bottom: `${sp.backButtonBottom ?? 39}px`,
        left: `${sp.backButtonLeft ?? 40}px`,
        position: 'absolute',
        zIndex: 1000
    };

    const arrowLeftStyle = {
        width: `${sp.arrowSize ?? 90}px`,
        height: `${sp.arrowSize ?? 90}px`,
        bottom: `${sp.arrowBottom ?? 134}px`,
        left: `${sp.arrowLeft ?? 30}px`,
        position: 'absolute',
        top: 'auto',
        transform: 'none',
        zIndex: 1000
    };

    const arrowRightStyle = {
        width: `${sp.arrowSize ?? 90}px`,
        height: `${sp.arrowSize ?? 90}px`,
        bottom: `${sp.arrowBottom ?? 134}px`,
        right: `${sp.arrowRight ?? 30}px`,
        position: 'absolute',
        top: 'auto',
        transform: 'none',
        zIndex: 1000
    };

    return (
        <div className="tubaroes-page">
            <TopBar />
            <Link to="/" className="tubaroes-back-button" style={backButtonStyle}>
                <img src="/assets/images/home.svg" alt="Home" className="home-icon-svg" style={{ width: `${sp.backButtonIconSize ?? 60}%`, height: `${sp.backButtonIconSize ?? 60}%` }} />
            </Link>

            <div
                className="tubaroes-carousel"
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerCancel}
                onPointerCancel={handlePointerCancel}
            >
                <AnimatePresence mode="wait">
                    <SlideContent
                        key={current}
                        slide={slides[current]}
                        sp={sp}
                    />
                </AnimatePresence>

                {current > 0 && (
                    <button
                        className="carousel-arrow arrow-left"
                        style={arrowLeftStyle}
                        onClick={() => goTo(current - 1)}
                        onPointerDown={(e) => e.stopPropagation()}
                    >
                        <img src="/assets/images/seta-esquerda.svg" alt="Anterior" className="arrow-icon-svg" style={{ width: '100%', height: '100%' }} />
                    </button>
                )}
                {current < slides.length - 1 && (
                    <button
                        className="carousel-arrow arrow-right"
                        style={arrowRightStyle}
                        onClick={() => goTo(current + 1)}
                        onPointerDown={(e) => e.stopPropagation()}
                    >
                        <img src="/assets/images/seta-direita.svg" alt="Próximo" className="arrow-icon-svg" style={{ width: '100%', height: '100%' }} />
                    </button>
                )}
            </div>

            <div className={`tubaroes-indicator ${currentSlide.type === 'shark-text' ? 'theme-dark' : ''}`}>
                {slides.map((_, i) => (
                    <div key={i} className={`indicator-dot ${i === current ? 'active' : ''}`} />
                ))}
            </div>
        </div>
    );
}

function SlideContent({ slide, sp }) {
    const renderText = (text) => ({
        __html: text
            .replace(/\*\*(.*?)\*\*/g, `<strong style="font-weight:bold;">$1</strong>`)
            .replace(/_(.*?)_/g, `<em style="font-style:italic;">$1</em>`)
    });

    if (slide.type === 'shark-text') {
        return (
            <motion.div
                className="tubaroes-slide slide-shark-text"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={containerVariants}
            >
                {slide.background && (
                    <div className="tubaroes-bg-static">
                        <img src={slide.background} alt="" className="bg-image" />
                    </div>
                )}
                <div
                    className="shark-text-inner"
                    style={{
                        paddingTop: sp.paddingTop !== undefined ? `${sp.paddingTop}px` : undefined,
                        paddingLeft: sp.paddingHorizontal !== undefined ? `${sp.paddingHorizontal}px` : undefined,
                        paddingRight: sp.paddingHorizontal !== undefined ? `${sp.paddingHorizontal}px` : undefined,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: sp.rowGap !== undefined ? `${sp.rowGap}px` : undefined,
                        maxWidth: sp.textMaxWidth !== undefined ? `${sp.textMaxWidth}px` : undefined
                    }}
                >
                    {slide.title && (
                        <motion.h1
                            className="shark-title"
                            variants={itemVariants}
                            style={{
                                fontSize: sp.titleSize !== undefined ? `${sp.titleSize}px` : undefined,
                                letterSpacing: sp.titleSpacing !== undefined ? `${sp.titleSpacing}px` : undefined,
                                fontWeight: sp.titleWeight,
                                lineHeight: sp.titleLineHeight,
                                marginBottom: '24px'
                            }}
                        >
                            {slide.title.split('\n').map((line, i) => (
                                <span key={i}>{line}<br /></span>
                            ))}
                        </motion.h1>
                    )}

                    <motion.div
                        className="shark-paragraphs"
                        variants={itemVariants}
                    >
                        {slide.paragraphs.map((p, i) => (
                            <p key={i} style={{
                                fontWeight: sp.textWeight,
                                fontSize: sp.textSize !== undefined ? `${sp.textSize}px` : undefined,
                                lineHeight: sp.textLineHeight,
                            }} dangerouslySetInnerHTML={renderText(p)} />
                        ))}
                    </motion.div>
                </div>
            </motion.div>
        );
    }

    if (slide.type === 'species-detail') {
        return (
            <motion.div
                className="tubaroes-slide slide-species-detail"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={containerVariants}
            >
                {/* Hero Section */}
                <motion.div
                    className="species-hero"
                    variants={itemVariants}
                    style={{ height: `${sp.heroHeight}px`, marginBottom: `${sp.heroMarginBottom}px` }}
                >
                    <img src={slide.heroImage} alt={slide.label} className="hero-image" />
                    <div className="hero-mask" style={{ opacity: sp.maskIntensity / 100 }} />
                </motion.div>

                {/* Content Section */}
                <div
                    className="species-content"
                    style={{
                        paddingLeft: `${sp.paddingHorizontal}px`,
                        paddingRight: `${sp.paddingHorizontal}px`,
                        paddingTop: `${sp.paddingTop}px`,
                        gap: `${sp.rowGap}px`
                    }}
                >
                    <motion.h1
                        className="species-title"
                        variants={itemVariants}
                        style={{
                            fontSize: `${sp.titleSize}px`,
                            letterSpacing: `${sp.titleSpacing}px`,
                            fontWeight: sp.titleWeight,
                            lineHeight: sp.titleLineHeight
                        }}
                    >
                        {slide.label}
                    </motion.h1>

                    {slide.binomialName && (
                        <motion.p
                            className="species-scientific"
                            variants={itemVariants}
                            style={{
                                fontSize: `${sp.subtitleSize}px`,
                                letterSpacing: `${sp.subtitleSpacing}px`,
                                marginTop: `${sp.subtitleMarginTop}px`,
                                fontWeight: sp.scientificNameWeight || 400,
                                fontStyle: sp.scientificNameItalic ? 'italic' : 'normal'
                            }}
                        >
                            {slide.binomialName}
                        </motion.p>
                    )}

                    <motion.div
                        className="species-paragraphs"
                        variants={itemVariants}
                        style={{
                            fontSize: `${sp.textSize}px`,
                            lineHeight: sp.textLineHeight,
                            maxWidth: `${sp.textMaxWidth}px`
                        }}
                    >
                        {slide.paragraphs.map((p, i) => (
                            <p key={i} style={{ fontWeight: sp.textWeight || 400 }} dangerouslySetInnerHTML={renderText(p)} />
                        ))}
                    </motion.div>
                </div>

                {/* Footer Section - Simplified (no extra line, with scale/offset) */}
                {slide.footerImage && (
                    <div
                        className="species-footer-wrapper"
                        style={{
                            position: 'absolute',
                            bottom: `${sp.footerVerticalOffset || 0}px`,
                            left: `${sp.footerHorizontalOffset || 0}px`,
                            transform: `scale(${sp.footerScale || 1})`,
                            transformOrigin: 'bottom left',
                            pointerEvents: 'none'
                        }}
                    >
                        <motion.div
                            className="species-footer"
                            variants={itemVariants}
                            style={{ width: 'auto' }}
                        >
                            <img src={slide.footerImage} alt="" className="footer-image" style={{ width: 'auto' }} />
                        </motion.div>
                    </div>
                )}
            </motion.div>
        );
    }

    return null;
}
