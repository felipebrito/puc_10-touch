import { useState, useRef, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import TopBar from '../components/TopBar';
import './ArraiasPage.css';

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
        type: 'ray-text',
        title: 'ARRAIAS AMEAÇADAS\nDE EXTINÇÃO NO BRASIL',
        background: '/assets/images/tubaroes/slide1_bg.png',
        guideImage: '/assets/guides/revisao-22-04/page-21.jpg',
        paragraphs: [
            'Os elasmobrânquios, grupo de animais em que estão inseridos as raias e tubarões, são geralmente capturados de forma acidental na pesca dirigida para espécies de peixes ósseos de alto valor comercial, como atuns, pescadas, tainhas etc.',
            'Atualmente, diversas espécies de tubarões e raias sofrem com reduções significativas em suas populações, incluindo algumas espécies já consideradas extintas ou em vias de extinção.'
        ],
    },
    {
        type: 'ray-text',
        background: '/assets/images/tubaroes/slide2_bg.png',
        guideImage: '/assets/guides/revisao-22-04/page-22.jpg',
        paragraphs: [
            'A principal ameaça às raias e tubarões é a perda de habitat, principalmente nas áreas costeiras e praias, devido à urbanização descontrolada e atividades industriais, tais como portos e dragagens em zonas de estuários, que alteram ou destroem as áreas de reprodução, alimentação e abrigo.',
            'As mudanças climáticas, que têm aumentado as temperaturas e a acidificação dos oceanos, alteram as cadeias alimentares e a distribuição das espécies, ampliando seu risco de extinção. Confira a seguir detalhes sobre essas espécies:'
        ],
    },
    {
        type: 'species-detail',
        id: 'raia-jamanta',
        label: 'RAIA-JAMANTA',
        scientificName: 'RAIA-JAMANTA',
        binomialName: 'Mobula birostris',
        heroImage: '/assets/images/raia-jamanta/hero.png',
        footerImage: '/assets/images/raia-jamanta/footer.png',
        guideImage: '/assets/guides/revisao-22-04/page-26.jpg',
        paragraphs: [
            'Maior raia conhecida, pode atingir mais de 7 m de largura de disco. Tem distribuição global em águas temperadas e tropicais.',
            'As maiores populações ocorrem ao longo das áreas das plataformas continentais, próximo a cadeias de ilhas e elevações submarinas.',
            'É suscetível a redes de emalhe-de-superfície e meia-água, sendo ocasionalmente capturada no arrasto-de-fundo (provavelmente no levantar e descer das redes).'
        ],
    },
];

export default function ArraiasPage({ config }) {
    const [current, setCurrent] = useState(0);
    const [searchParams] = useSearchParams();
    const dragStart = useRef(null);
    const isDragging = useRef(false);

    useEffect(() => {
        const slideParam = searchParams.get('slide');
        if (slideParam !== null) {
            const index = parseInt(slideParam) - 1;
            if (!isNaN(index) && index >= 0 && index < slides.length) {
                setCurrent(index);
            }
        }
    }, [searchParams]);

    const currentSlide = slides[current];

    useEffect(() => {
        window.__currentSlideIndex = current;
        window.__currentSpeciesId = currentSlide.type === 'species-detail' ? currentSlide.id : 'arraias';
        window.dispatchEvent(new CustomEvent('slide-changed'));
        return () => {
            window.__currentSlideIndex = undefined;
            window.__currentSpeciesId = undefined;
            window.dispatchEvent(new CustomEvent('slide-changed'));
        };
    }, [current, currentSlide]);

    const speciesId = 'arraias';
    const overrides = config?.speciesPageOverrides?.[speciesId] || {};
    const specificSpeciesId = currentSlide.type === 'species-detail' ? currentSlide.id : null;
    const specificOverrides = specificSpeciesId ? (config?.speciesPageOverrides?.[specificSpeciesId] || {}) : {};

    const sp = {
        ...config?.speciesPage,
        ...overrides,
        ...(overrides.slideOverrides?.[current] || {}),
        ...specificOverrides
    };

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
        <div className="arraias-page">
            <TopBar />
            <Link to="/" className="arraias-back-button" style={backButtonStyle}>
                <img src="/assets/images/home.svg" alt="Home" className="home-icon-svg" style={{ width: `${sp.backButtonIconSize ?? 60}%`, height: `${sp.backButtonIconSize ?? 60}%` }} />
            </Link>

            <div
                className="arraias-carousel"
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

            <div className={`arraias-indicator ${currentSlide.type === 'ray-text' ? 'theme-dark' : ''}`}>
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

    if (slide.type === 'ray-text') {
        return (
            <motion.div
                className="arraias-slide slide-ray-text"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={containerVariants}
            >
                {slide.background && (
                    <div className="arraias-bg-static">
                        <img src={slide.background} alt="" className="bg-image" />
                    </div>
                )}
                <div
                    className="ray-text-inner"
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
                            className="ray-title"
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
                        className="ray-paragraphs"
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
                className="arraias-slide slide-species-detail"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={containerVariants}
            >
                <motion.div
                    className="species-hero"
                    variants={itemVariants}
                    style={{ height: `${sp.heroHeight}px`, marginBottom: `${sp.heroMarginBottom}px` }}
                >
                    <img src={slide.heroImage} alt={slide.label} className="hero-image" />
                    <div className="hero-mask" style={{ opacity: sp.maskIntensity / 100 }} />
                </motion.div>

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
