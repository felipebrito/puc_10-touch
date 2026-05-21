import { useNavigate } from 'react-router-dom';
import './TopBar.css';

export default function TopBar() {
    const navigate = useNavigate();

    return (
        <div className="top-bar" onClick={() => navigate('/')}>
            <img src="/assets/cabecalho.png" alt="Extinção" className="header-image" />
        </div>
    );
}
