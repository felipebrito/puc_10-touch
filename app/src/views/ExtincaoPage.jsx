import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import TopBar from '../components/TopBar';
import './ExtincaoPage.css';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
    visible: {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        transition: { duration: 0.6, ease: 'easeOut' }
    }
};

const slides = [
    // Página 1 — EXTINÇÃO NOS OCEANOS (texto 1)
    {
        type: 'ocean-text',
        subtitle: 'EXTINÇÃO',
        title: 'NOS OCEANOS',
        paragraphs: [
            'Os oceanos cobrem mais de 70% da superfície do planeta e são essenciais para a vida na Terra.',
            'Eles regulam o clima e abrigam uma biodiversidade extraordinária, incluindo organismos que são responsáveis pela produção de cerca da metade do oxigênio do planeta e pela absorção de parte do dióxido de carbono da atmosfera.',
            'Infelizmente a vida nos oceanos está sendo impactada antes mesmo de ser plenamente conhecida, uma vez que boa parte ainda permanece inexplorada.',
        ],
    },
    // Página 2 — VÍDEO (sem texto)
    {
        type: 'video-only',
        video: '/assets/videos/perigo-extincao2.mp4',
    },
    // Página 3 — EXTINÇÃO NOS OCEANOS (texto 2 + SELOS)
    {
        type: 'ocean-text',
        subtitle: 'EXTINÇÃO',
        title: 'NOS OCEANOS',
        footerSeals: '/assets/images/pg04 imagem selos.png',
        paragraphs: [
            'Estima-se que conhecemos menos de 13% das espécies marinhas.',
            'A pesca predatória, a poluição plástica, as mudanças climáticas e a acidificação dos mares colocam em risco os ecossistemas marinhos, a saúde dos seres humanos e a própria estabilidade do planeta.',
            'Animais como a foca-monge-do-havaí, a raia-diabo, o atum-rabilho-do-sul, a baleia-azul e o pinguim-africano são exemplos de importantes espécies de diferentes regiões do planeta com risco de extinção.',
        ],
    },
    // Página 4 — AS AMEAÇAS À VIDA MARINHA
    {
        type: 'ocean-text',
        title: 'AS AMEAÇAS À VIDA MARINHA',
        subtitle: 'As ameaças o Brasil à biodiversidade marinha são:',
        paragraphs: [
            'A captura acidental em redes de pesca, que resulta em afogamento e morte de tartarugas marinhas, botos e principalmente de toninhas e peixes-boi.',
            'A caça ilegal e pesca predatória, em especial de tubarões e raias. Para as tartarugas marinhas, a caça e a coleta de ovos eram a maior ameaça até a década de 1980.',
            'Várias formas de poluição, tais como lixo plástico e produtos químicos tóxicos, que impactam à saúde e podem levar a morte dos indivíduos.',
        ],
    },
    // Página 5 — PESCA PREDATÓRIA
    {
        type: 'photo-collage',
        title: 'PESCA PREDATÓRIA',
        bgImage: '/assets/images/extincao/pesca_predatoria.jpg',
    },
    // Página 6 — POLUIÇÃO PLÁSTICA
    {
        type: 'photo-collage',
        title: 'POLUIÇÃO PLÁSTICA',
        bgImage: '/assets/images/extincao/poluicao_plastica.jpg',
    },
    // Página 7 — POLUIÇÃO INDUSTRIAL
    {
        type: 'photo-collage',
        title: 'POLUIÇÃO INDUSTRIAL',
        bgImage: '/assets/images/extincao/poluicao_industrial.png',
    },
    // Página 8 — MUDANÇAS CLIMÁTICAS
    {
        type: 'photo-collage',
        title: 'MUDANÇAS CLIMÁTICAS',
        bgImage: '/assets/images/extincao/mudancas_climaticas.png',
    },
    // Página 9 — LINKS ÚTEIS
    {
        type: 'links',
        title: 'LINKS ÚTEIS',
        text: 'Use o QRCODE abaixo para conhecer mais sobre projetos de conservação da fauna marinha.',
        qrCode: '/assets/images/extincao/qrcode.png'
    },
];

export default function ExtincaoPage({ config }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const trackRef = useRef(null);


    const ep = config?.extincaoPage || {};

    useEffect(() => {
        console.log("ExtincaoPage Config Update:", ep);
    }, [config]);

    const goTo = (index) => {
        if (index >= 0 && index < slides.length) {
            setCurrentIndex(index);
            window.dispatchEvent(new CustomEvent('extincao-slide-changed', { detail: index }));
        }
    };

    const nextSlide = () => {
        if (currentIndex < slides.length - 1) {
            const next = currentIndex + 1;
            setCurrentIndex(next);
            window.dispatchEvent(new CustomEvent('extincao-slide-changed', { detail: next }));
        }
    };

    const prevSlide = () => {
        if (currentIndex > 0) {
            const prev = currentIndex - 1;
            setCurrentIndex(prev);
            window.dispatchEvent(new CustomEvent('extincao-slide-changed', { detail: prev }));
        }
    };

    const handlePointerDown = (e) => {
        setIsDragging(true);
        setStartX(e.pageX);
    };

    const handlePointerMove = (e) => {
        if (!isDragging) return;
    };

    const handlePointerUp = (e) => {
        if (!isDragging) return;
        setIsDragging(false);
        const x = e.pageX;
        const walk = (x - startX);

        if (Math.abs(walk) > 100) {
            if (walk > 0) prevSlide();
            else nextSlide();
        }
    };

    useEffect(() => {
        const handleGoto = (e) => goTo(e.detail);

        window.addEventListener('goto-slide', handleGoto);
        return () => {
            window.removeEventListener('goto-slide', handleGoto);
        };
    }, []);

    return (
        <div className="extincao-page">
            {/* Fundo estático ou vídeo de alta fidelidade */}
            <div className="extincao-bg-static">
                <AnimatePresence mode="wait">
                    {slides[currentIndex].video ? (
                        <motion.video 
                            key={`video-${slides[currentIndex].video}`}
                            src={slides[currentIndex].video} 
                            autoPlay 
                            loop 
                            muted 
                            playsInline
                            className="extincao-bg-video"
                            initial={{ opacity: 0, filter: 'blur(10px)' }}
                            animate={{ opacity: 1, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, filter: 'blur(10px)' }}
                            transition={{ duration: 0.8 }}
                        />
                    ) : slides[currentIndex].bgImage ? (
                        <motion.img 
                            key={`img-${slides[currentIndex].bgImage}`}
                            src={slides[currentIndex].bgImage} 
                            alt="background" 
                            className="extincao-bg-image"
                            initial={{ opacity: 0, filter: 'blur(10px)' }}
                            animate={{ opacity: 1, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, filter: 'blur(10px)' }}
                            transition={{ duration: 0.8 }}
                        />
                    ) : (
                        <motion.img 
                            key="default-bg"
                            src="/assets/images/extincao_bg.png" 
                            alt="background"
                            initial={{ opacity: 0, filter: 'blur(10px)' }}
                            animate={{ opacity: 1, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, filter: 'blur(10px)' }}
                            transition={{ duration: 0.8 }}
                        />
                    )}
                </AnimatePresence>
                <div className="video-overlay" />
            </div>

            <TopBar />
            <Link to="/" className="extincao-back-button">
                <img src="/assets/images/home.svg" alt="Home" className="home-icon-svg" />
            </Link>

            {/* Carrossel — cada slide contém seu próprio fundo e conteúdo */}
            <div
                className="extincao-carousel"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
            >
                <div className="extincao-track" ref={trackRef}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, filter: 'blur(20px)' }}
                            animate={{ opacity: 1, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, filter: 'blur(20px)' }}
                            transition={{ duration: 0.6, ease: "easeInOut" }}
                            className="extincao-slide-wrapper"
                            style={{ position: 'absolute', inset: 0, width: '1080px' }}
                        >
                            {slides[currentIndex].type === 'ocean-text' ? (
                                <motion.div
                                    className="slide-inner"
                                    initial="hidden"
                                    animate="visible"
                                    variants={containerVariants}
                                    style={{
                                        paddingTop: `${ep.paddingTop ?? 195}px`,
                                        paddingLeft: `${ep.paddingLeft ?? 70}px`,
                                        paddingRight: `${ep.paddingLeft ?? 70}px`,
                                    }}
                                >
                                    <motion.div className="extincao-titles" variants={itemVariants}>
                                        {/* Subtítulo como Etiqueta (Acima do Título em S1, S3) */}
                                        {slides[currentIndex].subtitle && currentIndex !== 3 && (
                                            <span className="extincao-label" style={{
                                                fontSize: `${ep.subtitleSize ?? 73}px`,
                                                letterSpacing: `${ep.subtitleSpacing ?? 8.7}px`,
                                                lineHeight: ep.subtitleLineHeight ?? 1.1,
                                                fontWeight: ep.subtitleWeight ?? 400,
                                                width: `${ep.subtitleWidth ?? 900}px`,
                                                marginTop: `${ep.subtitleMarginTop ?? 0}px`,
                                                display: 'block'
                                            }}>{slides[currentIndex].subtitle}</span>
                                        )}

                                        <h1 className="extincao-title" style={{
                                            fontSize: `${ep.titleSize ?? 142}px`,
                                            letterSpacing: `${ep.titleSpacing ?? 9.6}px`,
                                            lineHeight: ep.titleLineHeight ?? 0.95,
                                            fontWeight: ep.titleWeight ?? 900,
                                            width: `${ep.titleWidth ?? 940}px`,
                                            marginTop: `${ep.titleMarginTop ?? 0}px`
                                        }}>{slides[currentIndex].title}</h1>

                                        <div className="extincao-separator" style={{
                                            width: `${ep.lineWidth ?? 922}px`,
                                            height: `${ep.lineHeight ?? 4.5}px`,
                                            marginTop: `${ep.lineMarginTop ?? 10}px`
                                        }} />

                                        {/* Subtítulo como Lead (Abaixo da Linha em S4) */}
                                        {slides[currentIndex].subtitle && currentIndex === 3 && (
                                            <div className="extincao-lead" style={{
                                                fontSize: `${ep.subtitleSize ?? 36}px`,
                                                letterSpacing: `${ep.subtitleSpacing ?? 0}px`,
                                                lineHeight: ep.subtitleLineHeight ?? 1.3,
                                                fontWeight: ep.subtitleWeight ?? 400,
                                                width: `${ep.subtitleWidth ?? 900}px`,
                                                marginTop: `${ep.subtitleMarginTop ?? 30}px`,
                                                color: '#ffffff',
                                                fontFamily: 'Canva Sans, sans-serif',
                                                display: 'block'
                                            }}>{slides[currentIndex].subtitle}</div>
                                        )}
                                    </motion.div>

                                    <motion.div 
                                        className="extincao-text" 
                                        variants={itemVariants}
                                        style={{
                                            fontSize: `${ep.textSize ?? 38}px`,
                                            lineHeight: ep.textLineHeight ?? 1.3,
                                            marginTop: `${ep.textMarginTop ?? 109}px`,
                                            width: `${ep.textWidth ?? 864}px`,
                                            fontWeight: ep.textWeight ?? 400
                                        }}
                                    >
                                        {slides[currentIndex].paragraphs.map((p, j) => (
                                            <p key={j}>{p}</p>
                                        ))}
                                    </motion.div>

                                    {slides[currentIndex].footerSeals && (
                                        <motion.div 
                                            className="extincao-seals"
                                            variants={itemVariants}
                                            style={{
                                                marginTop: `${ep.sealsMarginTop ?? 40}px`
                                            }}
                                        >
                                            <img 
                                                src={slides[currentIndex].footerSeals} 
                                                alt="Seals" 
                                                className="seals-img" 
                                                style={{ width: `${ep.sealsWidth ?? 949}px` }}
                                            />
                                        </motion.div>
                                    )}
                                </motion.div>
                            ) : (
                                <SlideContent key={currentIndex} slide={slides[currentIndex]} isActive={true} />
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Seta esquerda */}
                {currentIndex > 0 && (
                    <button
                        className="carousel-arrow arrow-left"
                        onClick={() => goTo(currentIndex - 1)}
                        onPointerDown={(e) => e.stopPropagation()}
                    >
                        <img src="/assets/images/seta-esquerda.svg" alt="Anterior" className="arrow-icon-svg" />
                    </button>
                )}

                {/* Seta direita */}
                {currentIndex < slides.length - 1 && (
                    <button
                        className="carousel-arrow arrow-right"
                        onClick={() => goTo(currentIndex + 1)}
                        onPointerDown={(e) => e.stopPropagation()}
                    >
                        <img src="/assets/images/seta-direita.svg" alt="Próximo" className="arrow-icon-svg" />
                    </button>
                )}
            </div>

            {/* Indicadores de página */}
            <div className="extincao-indicator">
                {slides.map((_, i) => (
                    <div key={i} className={`indicator-dot ${i === currentIndex ? 'active' : ''}`} />
                ))}
            </div>

            {/* Rodapé estático */}
            <div className="extincao-footer">

                <img src="/assets/rodape.png" alt="" className="extincao-rodape" />
            </div>
        </div>
    );
}

function SlideContent({ slide, isActive }) {
    const animate = isActive ? 'visible' : 'hidden';

    // Helper para formatar texto (negrito e itálico)
    const renderText = (text) => ({
        __html: text
            .replace(/\*\*(.*?)\*\*/g, `<strong style="font-weight:bold;">$1</strong>`)
            .replace(/_(.*?)_/g, `<em style="font-style:italic;">$1</em>`)
    });

    if (slide.type === 'video-only') {
        return <div className="extincao-slide slide-video-only" />;
    }

    if (slide.type === 'ocean-text') {
        return (
            <div className="extincao-slide slide-ocean-text">
                <motion.div
                    className="slide-inner"
                    initial="hidden"
                    animate={animate}
                    variants={containerVariants}
                >
                    <motion.div className="extincao-titles" variants={itemVariants}>
                        <span className="extincao-label">EXTINÇÃO</span>
                        <h1 className="extincao-title">NOS OCEANOS</h1>
                        <div className="extincao-separator" />
                    </motion.div>
                    <motion.div className="extincao-text" variants={itemVariants}>
                        {slide.paragraphs.map((p, i) => <p key={i} dangerouslySetInnerHTML={renderText(p)} />)}
                    </motion.div>
                </motion.div>
            </div>
        );
    }

    if (slide.type === 'photo-collage') {
        return (
            <div className="extincao-slide slide-photo-collage">
                {slide.image && (
                    <motion.img
                        src={slide.image}
                        alt=""
                        className="slide-bg collage-fill"
                        draggable={false}
                        initial={{ opacity: 0, filter: 'blur(15px)' }}
                        animate={isActive
                            ? { opacity: 1, filter: 'blur(0px)', transition: { duration: 0.8, ease: 'easeOut' } }
                            : { opacity: 0, filter: 'blur(15px)' }
                        }
                    />
                )}
                {slide.title && (
                    <motion.div
                        className="collage-title-overlay"
                        initial="hidden"
                        animate={animate}
                        variants={itemVariants}
                    >
                        <h1 className="collage-title">{slide.title}</h1>
                    </motion.div>
                )}
            </div>
        );
    }

    if (slide.type === 'riscos') {
        return (
            <div className="extincao-slide slide-riscos">
                <motion.div
                    className="slide-inner"
                    initial="hidden"
                    animate={animate}
                    variants={containerVariants}
                >
                    <motion.h1 className="riscos-title" variants={itemVariants}>{slide.title}</motion.h1>
                    <motion.p className="riscos-lead" variants={itemVariants}>{slide.lead}</motion.p>
                    <motion.ul className="riscos-list" variants={containerVariants}>
                        {slide.items.map((item, i) => (
                            <motion.li key={i} variants={itemVariants} dangerouslySetInnerHTML={renderText(item)} />
                        ))}
                    </motion.ul>
                </motion.div>
            </div>
        );
    }

    if (slide.type === 'links') {
        return (
            <div className="extincao-slide slide-links">
                <motion.div
                    className="slide-inner"
                    initial="hidden"
                    animate={animate}
                    variants={containerVariants}
                >
                    <motion.h1 className="links-title" variants={itemVariants}>{slide.title}</motion.h1>
                    <motion.p className="links-text" variants={itemVariants} dangerouslySetInnerHTML={renderText(slide.text)} />
                    <motion.div className="qrcode-wrapper" variants={itemVariants} style={{ display: 'flex', justifyContent: 'center', marginTop: '60px' }}>
                        {slide.qrCode && (
                            <img src={slide.qrCode} alt="QR Code" className="extincao-qrcode" style={{ width: '350px', height: '350px', objectFit: 'contain' }} />
                        )}
                    </motion.div>
                </motion.div>
            </div>
        );
    }

    return null;
}
