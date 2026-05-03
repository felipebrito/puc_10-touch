import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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
    visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
    visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.6, ease: 'easeOut' } },
};

const slides = [
    // Slide 1 — página 14 (texto)
    {
        type: 'turtle-text',
        title: 'TARTARUGAS\nMARINHAS',
        paragraphs: [
            'No Brasil ocorrem cinco das setes espécies de tartarugas marinhas: tartaruga-de-couro (_Dermochelys coriacea_), tartaruga-cabeçuda (_Caretta caretta_), tartaruga-oliva (_Lepidochelys olivacea_), tartaruga-de-pente (_Eretmochelys imbricata_) e a tartaruga-verde (_Chelonia mydas_).',
            'Elas colocam ovos nas áreas das praias das regiões mais quentes do país, inclusive em Fernando de Noronha, mas jovens e adultos vivem e se alimentam em alto-mar tendo ampla distribuição, inclusive no litoral do RS. Elas podem viver por muitas décadas, algumas até próximo de 100 anos. Uma curiosidade é que a temperatura da areia onde os ovos se desenvolvem é que determina o sexo em que o embrião vai se desenvolver.',
            'Normalmente temperaturas mais altas determinam fêmeas enquanto mais baixas desenvolvem machos. Por isso o aumento da temperatura do oceano é uma grande preocupação para a conservação destas espécies.',
        ],
    },
    // Slide 2 — página 15 (vídeo tartaruga)
    {
        type: 'turtle-video',
        video: VIDEOS.nadando_1,
    },
    // Slide 3 — página 16 (vídeo coral)
    {
        type: 'turtle-video',
        video: VIDEOS.nadando_1,
    },
    // Slide 4 — página extra (vídeo tartaruga 2)
    {
        type: 'turtle-video',
        video: VIDEOS.nadando_2,
    },
    // Slide 4 — página 17 (texto + URL)
    {
        type: 'turtle-text',
        title: 'TARTARUGAS\nMARINHAS:',
        paragraphs: [
            'Apesar de ainda existirem ameaças importantes, hoje, após décadas de atividades do Projeto Tamar nas áreas prioritárias de desova, a destruição dos ovos se tornou muito rara e outras ameaças estão sendo controladas.',
            'Com isso, quatro das espécies que ocorrem no Brasil estão com suas populações em processo de recuperação, e a tartaruga-verde deixou a lista de espécies em extinção. Isso só tem sido possível devido a atuação contínua do Tamar nas ações diretas de conservação e amplas atividades de educação ambiental e inclusão social nas áreas de mais ocorrência.',
            'Conheça mais sobre as tartarugas marinhas e como participar na sua conservação no site:',
        ],
        url: 'https://www.tamar.org.br/',
    },
];

export default function TartarugasPage() {
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
        <div className="tartarugas-page">
            <BackgroundVideo variant="full" />
            <TopBar />
             <Link to="/" className="tartarugas-back-button">
                <img src="/assets/images/home.svg" alt="Home" className="home-icon-svg" />
            </Link>

            <div
                className="tartarugas-carousel"
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerCancel}
                onPointerCancel={handlePointerCancel}
            >
                <div
                    className="tartarugas-track"
                    style={{ transform: `translateX(${-current * 1080}px)` }}
                >
                    {slides.map((slide, index) => (
                        <SlideContent key={index} slide={slide} isActive={index === current} />
                    ))}
                </div>

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

            <div className="tartarugas-footer">
                <img src="/assets/linha.svg" alt="" className="tartarugas-linha" />
                <img src="/assets/rodape.png" alt="" className="tartarugas-rodape" />
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

    if (slide.type === 'turtle-text') {
        return (
            <div className="tartarugas-slide slide-turtle-text">
                <motion.div
                    className="turtle-text-inner"
                    initial="hidden"
                    animate={animate}
                    variants={containerVariants}
                >
                    <motion.h1 className="turtle-title" variants={itemVariants}>
                        {slide.title.split('\n').map((line, i) => (
                            <span key={i}>{line}<br /></span>
                        ))}
                    </motion.h1>
                    <motion.div className="turtle-separator" variants={itemVariants} />
                    <motion.div className="turtle-paragraphs" variants={itemVariants}>
                        {slide.paragraphs.map((p, i) => <p key={i} dangerouslySetInnerHTML={renderText(p)} />)}
                        {slide.url && (
                            <p className="turtle-url">{slide.url}</p>
                        )}
                    </motion.div>
                </motion.div>
            </div>
        );
    }

    if (slide.type === 'turtle-video') {
        return (
            <div className="tartarugas-slide slide-turtle-video">
                <motion.video
                    className="turtle-full-video"
                    autoPlay
                    loop
                    muted
                    playsInline
                    initial={{ opacity: 0, filter: 'blur(15px)' }}
                    animate={isActive
                        ? { opacity: 1, filter: 'blur(0px)', transition: { duration: 0.8, ease: 'easeOut' } }
                        : { opacity: 0, filter: 'blur(15px)' }
                    }
                >
                    <source src={slide.video} type="video/mp4" />
                </motion.video>
            </div>
        );
    }

    return null;
}
