import './BackgroundVideo.css';

export default function BackgroundVideo({ variant = 'full' }) {
    return (
        <div className={`bg-video-container variant-${variant}`}>
            <video
                className="bg-video target-bg-video"
                autoPlay
                loop
                muted
                playsInline
                crossOrigin="anonymous"
                ref={(el) => {
                    if (el) el.playbackRate = 0.8;
                }}
            >
                <source src="/assets/videos/pg03_video_01.mp4" type="video/mp4" />
                <source src="/assets/videos/pg03_video_02.mp4" type="video/mp4" />
            </video>
            <div className="video-overlay" />
        </div>
    );
}
