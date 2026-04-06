import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import TopBar from '../components/TopBar';
import BackgroundVideo from '../components/BackgroundVideo';
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
        paragraphs: [
            'Os oceanos cobrem mais de 70% da superfície do planeta e são essenciais para a vida na Terra.',
            'Eles regulam o clima, produzem mais da metade do oxigênio que respiramos, absorvem grande parte do dióxido de carbono da atmosfera e abrigam uma biodiversidade extraordinária.',
            'Infelizmente a vida nos oceanos está sendo destruída muito antes de ser conhecida, uma vez que boa parte ainda permanece inexplorada.',
        ],
    },
    // Página 2 — EXTINÇÃO NOS OCEANOS (texto 2)
    {
        type: 'ocean-text',
        paragraphs: [
            'Estima-se que conhecemos menos de 13% das espécies marinhas.',
            'A pesca predatória, a poluição plástica, as mudanças climáticas e a acidificação dos mares colocam em risco os ecossistemas marinhos, a saúde dos seres humanos e a própria estabilidade do planeta.',
            'Animais como a foca-monge-do-havaí, a raia-diabo, o atum-rabilho-do-sul, a baleia-azul e o pinguim-africano são exemplos de importantes espécies de diferentes regiões do planeta com risco de extinção.',
        ],
    },
    // Página 3 — PESCA PREDATÓRIA (colagem de fotos)
    {
        type: 'photo-collage',
        title: 'PESCA PREDATÓRIA',
        image: '/assets/images/predatoria',
    },
    // Página 4 — PRINCIPAIS RISCOS
    {
        type: 'riscos',
        title: 'PRINCIPAIS RISCOS À EXTINÇÃO DE ESPÉCIES MARINHAS',
        lead: 'Atualmente, as principais causas que podem levar estes animais à extinção aqui no Brasil e no RS são:',
        items: [
            'A captura acidental em redes de pesca, que resulta em afogamento e morte de tartarugas marinhas, botos e principalmente de toninhas e peixes-boi;',
            'A caça ilegal e a pesca predatória, em especial de tubarões e arraias. Para as tartarugas marinhas, a caça e a coleta de ovos eram a maior ameaça histórica.',
            'Várias formas de poluição, tais como lixo plástico e produtos químicos tóxicos, que impactam a saúde e podem levar a morte dos indivíduos;',
        ],
    },
    // Página 5 — POLUIÇÃO (colagem de fotos)
    {
        type: 'photo-collage',
        title: null,
        image: '/assets/images/poluicao.png',
    },
    // Página 6 — LINKS ÚTEIS
    {
        type: 'links',
        title: 'LINKS ÚTEIS',
        text: 'No QRCODE abaixo você acessa todos os links para conhecer mais das espécies e das instituições, associações e ONGs que trabalham com a fauna marinha.',
    },
];

export default function ExtincaoPage() {
    const [current, setCurrent] = useState(0);
    const dragStart = useRef(null);
    const isDragging = useRef(false);

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
        <div className="extincao-page">
            {/* Vídeo em loop — mesmo da home */}
            <BackgroundVideo variant="full" />

            <TopBar />
            <Link to="/" className="extincao-back-button">🏠</Link>

            {/* Carrossel — cada slide contém seu próprio fundo e conteúdo */}
            <div
                className="extincao-carousel"
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerCancel}
                onPointerCancel={handlePointerCancel}
            >
                <div
                    className="extincao-track"
                    style={{ transform: `translateX(${-current * 1080}px)` }}
                >
                    {slides.map((slide, index) => (
                        <SlideContent key={index} slide={slide} isActive={index === current} />
                    ))}
                </div>

                {/* Seta esquerda */}
                {current > 0 && (
                    <button
                        className="carousel-arrow arrow-left"
                        onClick={() => goTo(current - 1)}
                        onPointerDown={(e) => e.stopPropagation()}
                    >
                        ‹
                    </button>
                )}

                {/* Seta direita */}
                {current < slides.length - 1 && (
                    <button
                        className="carousel-arrow arrow-right"
                        onClick={() => goTo(current + 1)}
                        onPointerDown={(e) => e.stopPropagation()}
                    >
                        ›
                    </button>
                )}
            </div>

            {/* Indicadores de página */}
            <div className="extincao-indicator">
                {slides.map((_, i) => (
                    <div key={i} className={`indicator-dot ${i === current ? 'active' : ''}`} />
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
                        {slide.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
                    </motion.div>
                </motion.div>
            </div>
        );
    }

    if (slide.type === 'photo-collage') {
        return (
            <div className="extincao-slide slide-photo-collage">
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
                            <motion.li key={i} variants={itemVariants}>{item}</motion.li>
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
                    <motion.p className="links-text" variants={itemVariants}>{slide.text}</motion.p>
                    <motion.div className="qrcode-placeholder" variants={itemVariants}>
                        <span className="qrcode-label">QR CODE</span>
                    </motion.div>
                </motion.div>
            </div>
        );
    }

    return null;
}
