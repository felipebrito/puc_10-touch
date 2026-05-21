import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import TopBar from '../components/TopBar';
import { whaleIntroData } from '../data/menuItems';
import './BaleiasIntroPage.css';

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

const titleVariants = {
    hidden: { opacity: 0, y: -20, filter: 'blur(10px)' },
    visible: {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        transition: { duration: 0.8, ease: "easeOut" }
    }
};

export default function BaleiasIntroPage({ config }) {
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const nextSpeciesId = searchParams.get('next') || 'baleia-jubarte';

    const overrides = config?.speciesPageOverrides?.['baleias-intro'] || {};
    const sp = {
        ...config?.speciesPage,
        ...overrides
    };

    const backButtonStyle = {
        width: `${sp.backButtonSize ?? 60}px`,
        height: `${sp.backButtonSize ?? 60}px`,
        bottom: `${sp.backButtonBottom ?? 39}px`,
        left: `${sp.backButtonLeft ?? 40}px`,
        position: 'absolute',
        pointerEvents: 'auto',
        zIndex: 1000
    };

    const nextButtonStyle = {
        width: `${sp.arrowSize ?? 90}px`,
        height: `${sp.arrowSize ?? 90}px`,
        bottom: `${sp.arrowBottom ?? 134}px`,
        right: `${sp.arrowRight ?? 30}px`,
        position: 'absolute',
        top: 'auto',
        transform: 'none',
        pointerEvents: 'auto',
        zIndex: 1000
    };

    const handleNext = () => {
        navigate(`/species/${nextSpeciesId}`);
    };

    // Helper to format text (bold and italics)
    const renderText = (text) => ({
        __html: text
            .replace(/\*\*(.*?)\*\*/g, `<strong style="font-weight:bold;">$1</strong>`)
            .replace(/_(.*?)_/g, `<em style="font-style:italic;">$1</em>`)
    });

    const bip = config?.baleiasIntroPage || {
        paddingTop: 218,
        paddingLeft: 86,
        subtitleSize: 54,
        subtitleSpacing: 6.0,
        titleSize: 72,
        titleSpacing: 3.0,
        titleLineHeight: 1.1,
        lineMarginTop: 20,
        lineHeight: 3.0,
        lineWidth: 908,
        textSize: 30,
        textLineHeight: 1.5,
        textMarginTop: 40,
        textMaxWidth: 908
    };

    return (
        <div className="baleias-intro-page">
            {/* Background Image with Cinematic Overlay */}
            <div className="baleias-intro-bg">
                <img 
                    src="/assets/images/baleia.jpg" 
                    alt="Baleias Jubarte e Franca" 
                    className="baleias-bg-img"
                />
                <div className="baleias-bg-overlay" />
            </div>

            <TopBar />

            <motion.div
                className="baleias-intro-content"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                style={{
                    paddingTop: `${bip.paddingTop}px`,
                    paddingLeft: `${bip.paddingLeft}px`,
                    paddingRight: `${bip.paddingLeft}px`
                }}
            >
                <div className="baleias-title-section">
                    <motion.h3 
                        className="baleias-subtitle"
                        variants={titleVariants}
                        style={{
                            fontSize: `${bip.subtitleSize}px`,
                            letterSpacing: `${bip.subtitleSpacing}px`
                        }}
                    >
                        {whaleIntroData.subtitle}
                    </motion.h3>
                    <motion.h1 
                        className="baleias-title"
                        variants={titleVariants}
                        style={{
                            fontSize: `${bip.titleSize}px`,
                            letterSpacing: `${bip.titleSpacing}px`,
                            lineHeight: bip.titleLineHeight
                        }}
                    >
                        {whaleIntroData.title.split('\n').map((line, i) => (
                            <span key={i}>
                                {line}
                                {i < whaleIntroData.title.split('\n').length - 1 && <br />}
                            </span>
                        ))}
                    </motion.h1>
                    <motion.div 
                        className="baleias-title-line"
                        variants={itemVariants}
                        style={{
                            width: `${bip.lineWidth}px`,
                            height: `${bip.lineHeight}px`,
                            marginTop: `${bip.lineMarginTop}px`
                        }}
                    />
                </div>

                <motion.div 
                    className="baleias-description" 
                    variants={itemVariants}
                    style={{
                        fontSize: `${bip.textSize}px`,
                        lineHeight: bip.textLineHeight,
                        marginTop: `${bip.textMarginTop}px`,
                        maxWidth: `${bip.textMaxWidth}px`
                    }}
                >
                    {whaleIntroData.paragraphs.map((p, i) => (
                        <p key={i} dangerouslySetInnerHTML={renderText(p)} />
                    ))}
                </motion.div>
            </motion.div>

            {/* Navigation Buttons (Back & Next) */}
            <div className="baleias-navigation">
                {/* Back Button (Bottom Left) */}
                <Link to="/" className="baleias-nav-button nav-back" style={backButtonStyle} title="Voltar para Início">
                    <img src="/assets/images/home.svg" alt="Home" className="home-icon-svg" style={{ width: `${sp.backButtonIconSize ?? 60}%`, height: `${sp.backButtonIconSize ?? 60}%`, filter: 'brightness(0) invert(1)' }} />
                </Link>

                {/* Next Button (Bottom Right) */}
                <button 
                    onClick={handleNext} 
                    className="baleias-nav-button nav-next" 
                    style={nextButtonStyle}
                    title="Avançar"
                >
                    <img src="/assets/images/seta-direita.svg" alt="Próximo" className="arrow-icon-svg" style={{ width: '60%', height: '60%' }} />
                    {/* Glowing pulse effect */}
                    <div className="pulse-glow" />
                </button>
            </div>

            {/* Footer */}
            <div className="baleias-footer">
                <img src="/assets/rodape.png" alt="" className="baleias-rodape-img" />
            </div>
        </div>
    );
}
