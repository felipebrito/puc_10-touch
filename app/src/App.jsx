import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './views/Home';
import SpeciesDetail from './views/SpeciesDetail';
import ExtincaoPage from './views/ExtincaoPage';
import TartarugasPage from './views/TartarugasPage';
import TubaroesPage from './views/TubaroesPage';
import { loadConfig } from './components/DesignEditor';
import WaterRipple from './components/WaterRipple';

function App() {
    const [config, setConfig] = useState(loadConfig);
    const [editorVisible, setEditorVisible] = useState(false);
    const [showGuide, setShowGuide] = useState(false);

    const toggleEditor = () => setEditorVisible(!editorVisible);

    return (
        <Router>
            <WaterRipple config={config} />
            <Routes>
                <Route 
                    path="/" 
                    element={
                        <Home 
                            config={config} 
                            setConfig={setConfig}
                            editorVisible={editorVisible}
                            onToggleEditor={toggleEditor}
                            showGuide={showGuide}
                            setShowGuide={setShowGuide}
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
                    path="/species/:id"
                    element={
                        <SpeciesDetail 
                            config={config} 
                            setConfig={setConfig}
                            editorVisible={editorVisible}
                            onToggleEditor={toggleEditor}
                            showGuide={showGuide}
                            setShowGuide={setShowGuide}
                        />
                    } 
                />
            </Routes>
        </Router>
    );
}

export default App;
