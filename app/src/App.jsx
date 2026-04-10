import { useState, useEffect, useRef, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import BottomBar from './components/BottomBar';
import Home from './views/Home';
import SpeciesDetail from './views/SpeciesDetail';
import ExtincaoPage from './views/ExtincaoPage';
import TartarugasPage from './views/TartarugasPage';
import TubaroesPage from './views/TubaroesPage';
import ArraiasPage from './views/ArraiasPage';
import { loadConfig } from './components/DesignEditor';

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

function App() {
    const [config, setConfig] = useState(loadConfig);
    const [editorVisible, setEditorVisible] = useState(false);
    const [scale, setScale] = useState(1);
    const [inactivityProgress, setInactivityProgress] = useState(0);

    useEffect(() => {
        const handleResize = () => {
            const s = window.innerHeight / 1920;
            setScale(s);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleEditor = () => setEditorVisible(!editorVisible);

    return (
        <Router>
            <InactivityManager onProgressChange={setInactivityProgress} />
            <div
                className="totem-scaler"
                style={{
                    transform: `scale(${scale})`,
                    transformOrigin: 'top center',
                    width: '1080px',
                    height: '1920px',
                    position: 'relative'
                }}
            >
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
                        element={<ExtincaoPage />}
                    />
                    <Route
                        path="/species/tartarugas-marinhas"
                        element={<TartarugasPage />}
                    />
                    <Route
                        path="/species/tubaroes"
                        element={<TubaroesPage config={config} />}
                    />
                    <Route
                        path="/species/arraias"
                        element={<ArraiasPage config={config} />}
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
                <BottomBar inactivityProgress={inactivityProgress} />
            </div>
        </Router>
    );
}

export default App;
