import './BottomBar.css';

export default function BottomBar({ inactivityProgress = 0 }) {
    return (
        <div className="bottom-bar">
            {inactivityProgress > 0 && (
                <div
                    className="inactivity-bar"
                    style={{ width: `${inactivityProgress * 100}%` }}
                />
            )}
            <img src="/assets/rodape.png" alt="Rodapé" className="footer-image" />
        </div>
    );
}
