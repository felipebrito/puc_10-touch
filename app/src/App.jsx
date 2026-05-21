import { useState, useEffect, useRef, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import BottomBar from './components/BottomBar';
import Home from './views/Home';
import SpeciesDetail from './views/SpeciesDetail';
import ExtincaoPage from './views/ExtincaoPage';
import TartarugasPage from './views/TartarugasPage';
import TubaroesPage from './views/TubaroesPage';
import ArraiasPage from './views/ArraiasPage';
import BaleiasIntroPage from './views/BaleiasIntroPage';
import GuideOverlay from './components/GuideOverlay';
import DesignEditor from './components/DesignEditor';
import { loadConfig, saveConfig } from './utils/designUtils';

const INACTIVITY_TIMEOUT = 120;
const WARNING_START = 60;

function InactivityManager({ onProgressChange }) {
    const navigate = useNavigate();
    const location = useLocation();
    const timerRef = useRef(null);
    const startTimeRef = useRef(null);
    const rafRef = useRef(null);

    const isHome = location.pathname === '/';

    const reset = useCallback(() => {
        onProgressChange(0);
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        if (timerRef.current) clearTimeout(timerRef.current);
        if (isHome) return;

        startTimeRef.current = Date.now();

        const tick = () => {
            const elapsed = (Date.now() - startTimeRef.current) / 1000;
            const warningElapsed = elapsed - (INACTIVITY_TIMEOUT - WARNING_START);
            if (warningElapsed > 0) {
                const progress = Math.min(warningElapsed / WARNING_START, 1);
                onProgressChange(progress);
            }
            if (elapsed < INACTIVITY_TIMEOUT) {
                rafRef.current = requestAnimationFrame(tick);
            }
        };

        timerRef.current = setTimeout(() => {
            navigate('/');
        }, INACTIVITY_TIMEOUT * 1000);

        rafRef.current = requestAnimationFrame(tick);
    }, [isHome, navigate, onProgressChange]);

    useEffect(() => {
        reset();
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [location.pathname]);

    useEffect(() => {
        if (isHome) return;
        const events = ['pointerdown', 'pointermove', 'keydown', 'wheel', 'touchstart'];
        events.forEach(e => window.addEventListener(e, reset, { passive: true }));
        return () => events.forEach(e => window.removeEventListener(e, reset));
    }, [isHome, reset]);

    return null;
}

function AppContent({ config, setConfig, editorVisible, toggleEditor, setInactivityProgress, inactivityProgress }) {
    const location = useLocation();
    const isHome = location.pathname === '/';

    return (
        <>
            <InactivityManager onProgressChange={setInactivityProgress} />
            <GuideOverlay />
            <Routes>
                <Route
                    path="/"
                    element={
                        <Home
                            config={config}
                            setConfig={setConfig}
                            editorVisible={editorVisible}
                            onToggleEditor={toggleEditor}
                        />
                    }
                />
                <Route
                    path="/species/perigo-extincao"
                    element={<ExtincaoPage config={config} />}
                />
                <Route
                    path="/species/tartarugas-marinhas"
                    element={<TartarugasPage config={config} />}
                />
                <Route
                    path="/species/tubaroes"
                    element={<TubaroesPage config={config} />}
                />
                <Route
                    path="/species/raias"
                    element={<ArraiasPage config={config} />}
                />
                <Route
                    path="/species/baleias-intro"
                    element={<BaleiasIntroPage config={config} />}
                />
                <Route
                    path="/species/:id"
                    element={
                        <SpeciesDetail
                            config={config}
                            setConfig={setConfig}
                            editorVisible={editorVisible}
                            onToggleEditor={toggleEditor}
                        />
                    }
                />
            </Routes>
            
            {/* O padrão azul (BottomBar) só aparece na Home */}
            {isHome && <BottomBar inactivityProgress={inactivityProgress} />}
        </>
    );
}

function App() {
    const [config, setConfig] = useState(loadConfig);
    const [editorVisible, setEditorVisible] = useState(false);
    const [scale, setScale] = useState(1);
    const [inactivityProgress, setInactivityProgress] = useState(0);

    // Save and sync config changes
    const updateConfig = (newConfig) => {
        setConfig(newConfig);
        saveConfig(newConfig);
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key.toLowerCase() === 'c' || e.key.toLowerCase() === 'p') {
                toggleEditor();
            }
            // Screen rotation shortcuts
            if (['1', '2', '3', '4'].includes(e.key)) {
                const rotMap = { '1': 0, '2': 90, '3': 180, '4': 270 };
                updateConfig({ ...config, appRotation: rotMap[e.key] });
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [config, editorVisible]);

    useEffect(() => {
        const handleResize = () => {
            const rot = config.appRotation || 0;
            const W = window.innerWidth;
            const H = window.innerHeight;
            
            // If rotated sideways, swap dimensions for scale calculation
            let s = 1;
            if (rot === 90 || rot === 270) {
                s = Math.min(W / 1920, H / 1080);
            } else {
                s = Math.min(W / 1080, H / 1920);
            }
            setScale(s);
        };
        
        handleResize();
        window.addEventListener('resize', handleResize);
        
        // --- Cursor Management ---
        const handlePointer = (e) => {
            if (e.pointerType === 'touch') {
                document.documentElement.classList.add('using-touch');
                document.body.classList.add('using-touch');
            }
        };

        window.addEventListener('pointerdown', handlePointer, { passive: true });
        window.addEventListener('pointermove', handlePointer, { passive: true });

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('pointerdown', handlePointer);
            window.removeEventListener('pointermove', handlePointer);
        };
    }, [config.appRotation]);

    const toggleEditor = () => setEditorVisible(!editorVisible);

    return (
        <Router>
            <div
                className="totem-scaler"
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: `translate(-50%, -50%) scale(${scale}) rotate(${config.appRotation || 0}deg)`,
                    transformOrigin: 'center center',
                    width: '1080px',
                    height: '1920px'
                }}
            >
                <AppContent 
                    config={config} 
                    setConfig={setConfig} 
                    editorVisible={editorVisible} 
                    toggleEditor={toggleEditor} 
                    setInactivityProgress={setInactivityProgress}
                    inactivityProgress={inactivityProgress}
                />
                
                {/* Global Design Editor Overlay */}
                <DesignEditor
                    config={config}
                    setConfig={setConfig}
                    visible={editorVisible}
                    onToggle={toggleEditor}
                />
            </div>
        </Router>
    );
}

export default App;
