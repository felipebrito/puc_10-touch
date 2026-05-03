import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import TopBar from '../components/TopBar';
import BackgroundVideo from '../components/BackgroundVideo';
import './TartarugasPage.css';

// Vídeos Temáticos do Pexels (Alta Qualidade / Vertical 1080x1920)
const VIDEOS = {
    nadando_1: 'https://www.pexels.com/download/video/28248673/',
    nadando_2: 'https://www.pexels.com/download/video/28539798/',
    corais: 'https://www.pexels.com/download/video/2824867https://www.pexels.com/download/video/11407219/',
};

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
        type: 'turtle-text',
        title: 'TARTARUGAS-MARINHAS',
        background: '/assets/images/tartarugas/bg.png',
        paddingLeft: 178,
        paddingRight: 178,
        textMaxWidth: 1080,
        paragraphs: [
            'No Brasil ocorrem cinco das setes espécies de tartarugas marinhas: tartaruga-de-couro (_Dermochelys coriacea_), tartaruga-cabeçuda (_Caretta caretta_), tartaruga-oliva (_Lepidochelys olivacea_), tartaruga-de-pente (_Eretmochelys imbricata_) e a tartaruga-verde (_Chelonia mydas_).',
            'Põem ovos nas áreas de praia das regiões mais quentes do país, inclusive na ilha de Fernando de Noronha, mas jovens e adultos vivem e se alimentam em alto-mar, tendo ampla distribuição, inclusive no litoral do Rio Grande do Sul.',
            'Podem viver por muitas décadas, algumas até próximo dos 100 anos. Uma curiosidade é que a temperatura da areia onde os ovos se desenvolvem é que determina o sexo em que o embrião vai se desenvolver.',
            'Normalmente, temperaturas mais altas determinam fêmeas, enquanto mais baixas desenvolvem machos. Por isso, o aumento da temperatura dos oceanos é uma grande preocupação para a conservação destas espécies.'
        ],
    },
    // Slide 2 — Imagem 2
    {
        type: 'turtle-image',
        background: '/assets/images/tartarugas/slide2.jpg',
    },
    // Slide 3 — Imagem 3
    {
        type: 'turtle-image',
        background: '/assets/images/tartarugas/slide3.jpg',
    },
    // Slide 4 — Texto Final (Page 19)
    {
        type: 'turtle-text',
        title: 'É POSSÍVEL COMBATER A EXTINÇÃO: O SUCESSO DO PROJETO TAMAR',
        background: '/assets/images/tartarugas/pg19_BG.png',
        paddingLeft: 178,
        paddingRight: 178,
        textMaxWidth: 1080,
        paragraphs: [
            'Apesar de ainda existirem ameaças importantes, hoje, após décadas de atividades do Projeto Tamar nas áreas prioritárias de desova, a destruição dos ovos de tartarugas-marinhas tornou-se muito rara e outras ameaças a estas espécies estão sendo controladas.',
            'Com isso, quatro das espécies que ocorrem no Brasil apresentam populações em processo de recuperação, e a tartaruga-verde deixou a lista de espécies em extinção.',
            'Isto só tornou-se possível devido à atuação contínua do Projeto Tamar nas ações diretas de conservação e amplas atividades de educação ambiental e inclusão social nas áreas de maior ocorrência.',
            'Conheça mais sobre as tartarugas-marinhas e como participar na sua conservação nos canais de comunicação do Projeto Tamar.'
        ],
        url: '',
    },
];

export default function TartarugasPage({ config }) {
    const [current, setCurrent] = useState(0);
    const dragStart = useRef(null);
    const isDragging = useRef(false);

    // Resolve design configuration
    const speciesId = 'tartarugas-marinhas';
    const sp = {
        ...config?.speciesPage,
        ...(config?.speciesPageOverrides?.[speciesId] || {})
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

    return (
        <div className="tartarugas-page">
            <TopBar />
            <Link to="/" className="tartarugas-back-button" style={{
                width: `${sp.backButtonSize ?? 80}px`,
                height: `${sp.backButtonSize ?? 80}px`,
                bottom: `${sp.backButtonBottom ?? 40}px`,
                left: `${sp.backButtonLeft ?? 40}px`,
            }}>
                <img src="/assets/images/home.svg" alt="Home" className="home-icon-svg" />
            </Link>

            <div
                className="tartarugas-carousel"
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerCancel}
                onPointerCancel={handlePointerCancel}
            >
                <AnimatePresence mode="wait">
                    <SlideContent
                        key={current}
                        slide={slides[current]}
                        isActive={true}
                        sp={sp}
                    />
                </AnimatePresence>

                {current > 0 && (
                    <button
                        className="carousel-arrow-t arrow-left-t"
                        onClick={() => goTo(current - 1)}
                        onPointerDown={(e) => e.stopPropagation()}
                    >
                        <img src="/assets/images/seta-esquerda.svg" alt="Anterior" className="arrow-icon-svg" />
                    </button>
                )}
                {current < slides.length - 1 && (
                    <button
                        className="carousel-arrow-t arrow-right-t"
                        onClick={() => goTo(current + 1)}
                        onPointerDown={(e) => e.stopPropagation()}
                    >
                        <img src="/assets/images/seta-direita.svg" alt="Próximo" className="arrow-icon-svg" />
                    </button>
                )}
            </div>

            <div className="tartarugas-indicator">
                {slides.map((_, i) => (
                    <div key={i} className={`indicator-dot-t ${i === current ? 'active' : ''}`} />
                ))}
            </div>
        </div>
    );
}

function SlideContent({ slide, isActive, sp }) {
    // Helper para formatar texto (negrito e itálico)
    const renderText = (text) => ({
        __html: text
            .replace(/\*\*(.*?)\*\*/g, `<strong style="font-weight:bold;">$1</strong>`)
            .replace(/_(.*?)_/g, `<em style="font-style:italic;">$1</em>`)
    });

    if (slide.type === 'turtle-text') {
        return (
            <motion.div
                className="tartarugas-slide slide-turtle-text"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={containerVariants}
            >
                {slide.background && (
                    <div className="tartarugas-bg-static">
                        <img src={slide.background} alt="" className="bg-image" />
                    </div>
                )}
                <div
                    className="turtle-text-inner"
                    style={{
                        paddingTop: `${slide.paddingTop ?? sp.paddingTop}px`,
                        paddingLeft: `${slide.paddingLeft ?? sp.paddingLeft ?? sp.paddingHorizontal}px`,
                        paddingRight: `${slide.paddingRight ?? sp.paddingRight ?? sp.paddingHorizontal}px`,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: `${sp.rowGap}px`,
                        maxWidth: `${slide.textMaxWidth ?? sp.textMaxWidth ?? 800}px`
                    }}
                >
                    <motion.h1
                        className="turtle-title"
                        variants={itemVariants}
                        style={{
                            fontSize: `${sp.titleSize}px`,
                            letterSpacing: `${sp.titleSpacing}px`,
                            fontWeight: sp.titleWeight,
                            lineHeight: sp.titleLineHeight,
                            marginBottom: 0
                        }}
                    >
                        {slide.title}
                    </motion.h1>

                    <motion.div
                        className="turtle-paragraphs"
                        variants={itemVariants}
                        style={{
                            fontSize: `${sp.textSize}px`,
                            lineHeight: sp.textLineHeight,
                            maxWidth: `${slide.textMaxWidth ?? sp.textMaxWidth ?? 918}px`,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: `${sp.rowGap * 0.6}px`
                        }}
                    >
                        {slide.paragraphs.map((p, i) => (
                            <p key={i} style={{
                                margin: 0,
                                fontWeight: sp.textWeight || 400
                            }} dangerouslySetInnerHTML={renderText(p)} />
                        ))}
                        {slide.url && (
                            <p className="turtle-url" style={{
                                fontSize: `${sp.footerUrlSize}px`,
                                color: sp.footerUrlColor,
                                marginTop: '10px'
                            }}>{slide.url}</p>
                        )}
                    </motion.div>
                </div>
            </motion.div>
        );
    }

    if (slide.type === 'turtle-video') {
        return (
            <motion.div
                className="tartarugas-slide slide-turtle-video"
                initial={{ opacity: 0, filter: 'blur(10px)' }}
                animate={{ opacity: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, filter: 'blur(10px)' }}
                transition={{ duration: 0.6 }}
            >
                {slide.background && (
                    <div className="tartarugas-bg-static">
                        <img src={slide.background} alt="" className="bg-image" />
                    </div>
                )}
                <video
                    src={slide.video}
                    className="turtle-full-video"
                    autoPlay
                    loop
                    muted
                    playsInline
                />
            </motion.div>
        );
    }

    if (slide.type === 'turtle-image') {
        return (
            <motion.div
                className="tartarugas-slide slide-turtle-image"
                initial={{ opacity: 0, filter: 'blur(10px)' }}
                animate={{ opacity: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, filter: 'blur(10px)' }}
                transition={{ duration: 0.6 }}
            >
                {slide.background && (
                    <div className="tartarugas-bg-static">
                        <img src={slide.background} alt="" className="bg-image" />
                    </div>
                )}
            </motion.div>
        );
    }

    return null;
}
