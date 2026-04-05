import './BackgroundVideo.css';

export default function BackgroundVideo({ variant = 'full' }) {
    return (
        <div className={`bg-video-container variant-${variant}`}>
            <video
                className="bg-video"
                autoPlay
                loop
                muted
                playsInline
                ref={(el) => {
                    if (el) el.playbackRate = 0.8;
                }}
            >
                <source src="https://videos.pexels.com/video-files/2556610/2556610-hd_1920_1080_30fps.mp4" type="video/mp4" />
                <source src="https://videos.pexels.com/video-files/1093662/1093662-hd_1920_1080_30fps.mp4" type="video/mp4" />
            </video>
            <div className="video-overlay" />
        </div>
    );
}
