import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import TopBar from '../components/TopBar';
import BackgroundVideo from '../components/BackgroundVideo';
import MenuGrid from '../components/MenuGrid';
import './ArraiasPage.css';

const RAY_SPECIES = [
    { id: 'raia-jamanta', label: 'RAIA-\nJAMANTA', image: '/assets/images/raia_jamanta.png' },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
    visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.6, ease: 'easeOut' } },
};

export default function ArraiasPage({ config }) {
    const navigate = useNavigate();

    const handleItemClick = (item) => {
        navigate(`/species/${item.id}`);
    };

    const content = {
        title: 'ARRAIAS AMEAÇADAS\nDE EXTINÇÃO NO BRASIL',
        paragraphs: [
            'Os elasmobrânquios, onde estão inseridos as arraias e os tubarões, são geralmente capturados de forma incidental na pesca dirigida para espécies de peixes ósseos de alto valor comercial, como atuns, pescadas, tainhas, etc. Atualmente, diversas espécies de tubarões e raias vem sofrendo com reduções significativas em suas populações, com algumas espécies já consideradas extintas ou em vias de extinção.',
            'A perda de habitat, principalmente nas áreas costeiras e praias, pela urbanização descontrolada e atividades industriais tais como portos e dragagens em zonas estuarinas, que alteram ou destroem as áreas de reprodução, alimentação e abrigo. As mudanças climáticas que têm aumentado as temperaturas e a acidificação dos oceanos, alterando as cadeias alimentares e a distribuição das espécies.',
        ],
    };

    return (
        <div className="arraias-page">
            <BackgroundVideo variant="full" />
            <TopBar />
            <Link to="/" className="arraias-back-button">
                <img src="/assets/images/home.svg" alt="Home" className="home-icon-svg" />
            </Link>

            <div className="arraias-static-content">
                <div className="ray-text-inner">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                    >
                        <motion.h1 className="ray-title" variants={itemVariants}>
                            {content.title.split('\n').map((line, i) => (
                                <span key={i}>{line}<br /></span>
                            ))}
                        </motion.h1>
                        <motion.div className="ray-separator" variants={itemVariants} />
                        <motion.div className="ray-paragraphs" variants={itemVariants}>
                            {content.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
                        </motion.div>

                        <motion.div className="ray-species-section" variants={itemVariants}>
                            <MenuGrid
                                items={RAY_SPECIES}
                                onItemClick={handleItemClick}
                                config={config}
                                selectedCard={null}
                                ignoreOverrides={true}
                            />
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            <div className="arraias-footer">
                <img src="/assets/linha.svg" alt="" className="arraias-linha" />
                <img src="/assets/rodape.png" alt="" className="arraias-rodape" />
            </div>
        </div>
    );
}
