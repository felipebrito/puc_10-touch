import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import TopBar from '../components/TopBar';
import BackgroundVideo from '../components/BackgroundVideo';
import MenuGrid from '../components/MenuGrid';
import './TubaroesPage.css';

const SHARK_SPECIES = [
    { id: 'tubarao-mangona', label: 'TUBARÃO\nMANGONA', image: '/assets/images/mangona_thumb.png' },
    { id: 'tubarao-martelo', label: 'TUBARÃO-MARTELO\nGRANDE', image: '/assets/images/martelo_thumb.png' },
    { id: 'cacao-anjo', label: 'CAÇÃO-ANJO-DE\nASA-LONGA', image: '/assets/images/cacao_anjo_thumb.png' },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
    visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.6, ease: 'easeOut' } },
};

export default function TubaroesPage({ config }) {
    const navigate = useNavigate();

    // Resolve design configuration
    const speciesId = 'tubaroes';
    const sp = {
        ...config?.speciesPage,
        ...(config?.speciesPageOverrides?.[speciesId] || {})
    };

    // Helper para formatar texto (negrito e itálico)
    const renderText = (text) => ({
        __html: text
            .replace(/\*\*(.*?)\*\*/g, `<strong style="font-weight:bold;">$1</strong>`)
            .replace(/_(.*?)_/g, `<em style="font-style:italic;">$1</em>`)
    });

    const handleItemClick = (item) => {
        navigate(`/species/${item.id}`);
    };

    const content = {
        title: 'TUBARÕES AMEAÇADOS\nDE EXTINÇÃO NO BRASIL',
        paragraphs: [
            'Os elasmobrânquios, onde estão inseridos os tubarões e arraias, são geralmente capturados de forma incidental na pesca dirigida para espécies de peixes ósseos de alto valor comercial, como atuns, pescadas, tainhas, etc. Atualmente, diversas espécies de tubarões e raias vem sofrendo com reduções significativas em suas populações, com algumas espécies já consideradas extintas ou em vias de extinção.',
            'A perda de habitat, principalmente nas áreas costeiras e praias, pela urbanização descontrolada e atividades industriais tais como portos e dragagens em zonas estuarinas, que alteram ou destroem as áreas de reprodução, alimentação e abrigo. As mudanças climáticas que têm aumentado as temperaturas e a acidificação dos oceanos, alterando as cadeias alimentares e a distribuição das espécies.',
        ],
    };

    return (
        <div className="tubaroes-page">
            <BackgroundVideo variant="full" />
            <TopBar />
            <Link to="/" className="tubaroes-back-button" style={{
                 width: `${sp.backButtonSize ?? 80}px`,
                 height: `${sp.backButtonSize ?? 80}px`,
                 bottom: `${sp.backButtonBottom ?? 40}px`,
                 left: `${sp.backButtonLeft ?? 40}px`,
             }}>
                <img src="/assets/images/home.svg" alt="Home" className="home-icon-svg" />
            </Link>

            <div className="tubaroes-static-content">
                <div className="shark-text-inner" style={{
                        paddingLeft: `${sp.paddingHorizontal}px`,
                        paddingRight: `${sp.paddingHorizontal}px`,
                        paddingTop: `${sp.paddingTop + 80}px`,
                        gap: `${sp.rowGap}px`
                    }}>
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                    >
                        <motion.h1 
                            className="shark-title" 
                            variants={itemVariants}
                            style={{
                                fontSize: `${sp.titleSize}px`,
                                letterSpacing: `${sp.titleSpacing}px`,
                                fontWeight: sp.titleWeight,
                                lineHeight: sp.titleLineHeight
                            }}
                        >
                            {content.title.split('\n').map((line, i) => (
                                <span key={i}>{line}<br /></span>
                            ))}
                        </motion.h1>
                        <motion.div className="shark-separator" variants={itemVariants} />
                        <motion.div 
                            className="shark-paragraphs" 
                            variants={itemVariants}
                            style={{
                                fontSize: `${sp.textSize}px`,
                                lineHeight: sp.textLineHeight,
                                maxWidth: `${sp.textMaxWidth ?? 918}px`,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: `${sp.rowGap * 0.6}px`
                            }}
                        >
                            {content.paragraphs.map((p, i) => (
                                <p key={i} style={{ 
                                    margin: 0,
                                    fontWeight: sp.textWeight || 400
                                }} dangerouslySetInnerHTML={renderText(p)} />
                            ))}
                        </motion.div>

                        <motion.div className="shark-species-section" variants={itemVariants}>
                            <MenuGrid 
                                items={SHARK_SPECIES} 
                                onItemClick={handleItemClick} 
                                config={config} 
                                selectedCard={null}
                                ignoreOverrides={true}
                            />
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            <div className="tubaroes-footer">
                <img src="/assets/linha.svg" alt="" className="tubaroes-linha" />
                <img src="/assets/rodape.png" alt="" className="tubaroes-rodape" />
            </div>
        </div>
    );
}
