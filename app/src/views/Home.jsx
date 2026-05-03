import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import TopBar from '../components/TopBar';
import BottomBar from '../components/BottomBar';
import MenuGrid from '../components/MenuGrid';
import { menuItems } from '../data/menuItems';
import './Home.css';

const titleContainerVariants = {
    hidden: { opacity: 1 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
};

const titleItemVariants = {
    hidden: { opacity: 0, filter: 'blur(15px)', y: 20 },
    visible: {
        opacity: 1,
        filter: 'blur(0px)',
        y: 0,
        transition: { duration: 0.8, ease: 'easeOut' }
    }
};

export default function Home({ config, setConfig, editorVisible, onToggleEditor }) {
    const [selectedCard, setSelectedCard] = useState(null);
    const navigate = useNavigate();

    const handleItemClick = (item) => {
        // Navigate to species detail page
        navigate(`/species/${item.id}`);
    };

    const tc = config.title;

    return (
        <div className="home-view">
            <div className="home-bg-static">
                <img src="/assets/images/home_bg.png" alt="background" />
                <div className="video-overlay" />
            </div>
            <TopBar />

            <div className="home-content">
                {/* Title Section */}
                <motion.div
                    className="home-title-section"
                    style={{
                        paddingTop: `${tc.paddingTop}px`,
                        paddingLeft: `${tc.paddingLeft}px`,
                        paddingRight: `${tc.paddingLeft}px`,
                    }}
                    variants={titleContainerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.h3
                        className="home-subtitle"
                        style={{
                            fontSize: `${tc.subtitleSize}px`,
                            letterSpacing: `${tc.subtitleSpacing}px`,
                        }}
                        variants={titleItemVariants}
                    >
                        EXTINÇÃO
                    </motion.h3>
                    <motion.h1
                        className="home-title"
                        style={{
                            fontSize: `${tc.titleSize}px`,
                            letterSpacing: `${tc.titleSpacing}px`,
                        }}
                        variants={titleItemVariants}
                    >
                        NOS OCEANOS
                    </motion.h1>
                    <motion.div
                        className="home-title-line"
                        style={{
                            width: `${tc.lineWidth}px`,
                            height: `${tc.lineHeight}px`,
                            marginTop: `${tc.lineMarginTop}px`,
                        }}
                        variants={titleItemVariants}
                    />
                    <motion.p
                        className="home-description"
                        style={{
                            fontSize: `${tc.descriptionSize}px`,
                            letterSpacing: `${tc.descriptionSpacing}px`,
                            marginTop: `${tc.descriptionMarginTop}px`,
                            fontWeight: tc.descriptionWeight || 300,
                        }}
                        variants={titleItemVariants}
                    >
                        Exemplos de espécies em risco e suas principais ameaças:
                    </motion.p>
                </motion.div>

                {/* Menu Grid */}
                <div
                    className="home-menu-section"
                    style={{ paddingTop: `${config.grid.paddingTop}px` }}
                >
                    <MenuGrid 
                        items={menuItems} 
                        onItemClick={handleItemClick} 
                        config={config} 
                        selectedCard={selectedCard} 
                    />
                </div>
            </div>

            <BottomBar />

        </div>
    );
}
