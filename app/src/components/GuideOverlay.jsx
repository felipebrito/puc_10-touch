import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { menuItems, speciesDetails } from '../data/menuItems';
import './GuideOverlay.css';

export default function GuideOverlay() {
    const [visible, setVisible] = useState(false);
    const [opacity, setOpacity] = useState(0.5);
    const [currentExtincaoSlide, setCurrentExtincaoSlide] = useState(0);
    const location = useLocation();

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key.toLowerCase() === 'g') {
                setVisible(prev => !prev);
            }
            if (e.key === '+') {
                setOpacity(prev => Math.min(prev + 0.1, 1));
            }
            if (e.key === '-') {
                setOpacity(prev => Math.max(prev - 0.1, 0));
            }
        };

        const handleSlideChange = (e) => setCurrentExtincaoSlide(e.detail);

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('extincao-slide-changed', handleSlideChange);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('extincao-slide-changed', handleSlideChange);
        };
    }, []);

    if (!visible) return null;

    // Determine which guide image to show based on route
    let guideImage = null;

    if (location.pathname === '/') {
        // Home page reference is likely page 1
        guideImage = '/assets/guides/revisao-22-04/page-01.jpg';
    } else if (location.pathname === '/species/perigo-extincao') {
        const mapping = {
            0: '/assets/guides/revisao-22-04/page-02.jpg',
            2: '/assets/guides/revisao-22-04/page-04.jpg',
            3: '/assets/guides/revisao-22-04/page-05.jpg'
        };
        guideImage = mapping[currentExtincaoSlide] || '/assets/guides/revisao-22-04/page-02.jpg';
    } else if (location.pathname === '/species/tubaroes') {
        guideImage = '/assets/guides/revisao-22-04/page-23.jpg';
    } else if (location.pathname === '/species/arraias') {
        guideImage = '/assets/guides/revisao-22-04/page-25.jpg';
    } else if (location.pathname === '/species/tartarugas-marinhas') {
        guideImage = '/assets/guides/revisao-22-04/page-14.jpg';
    } else {
        const match = location.pathname.match(/^\/species\/(.+)$/);
        if (match) {
            const id = match[1];
            const species = menuItems.find(item => item.id === id) || speciesDetails[id];
            if (species?.guideImage) {
                guideImage = species.guideImage;
            }
        }
    }

    if (!guideImage) return null;

    return (
        <div 
            className="guide-overlay"
            style={{
                opacity: opacity,
                backgroundImage: `url(${guideImage})`
            }}
        >
            <div className="guide-info">
                Reference: {guideImage} ({Math.round(opacity * 100)}%)
                <br />
                'G' to toggle | '+' / '-' to change opacity
            </div>
        </div>
    );
}
