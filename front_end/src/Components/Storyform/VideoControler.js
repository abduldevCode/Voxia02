import { useState, useRef, useEffect } from "react";

function VideoPlayer({ selectedVideo }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;

    // Update progress bar
    const updateProgress = () => {
      const progressValue = (video.currentTime / video.duration) * 100;
      setProgress(progressValue);
    };

    if (video) {
      video.addEventListener("timeupdate", updateProgress);
    }

    return () => {
      if (video) {
        video.removeEventListener("timeupdate", updateProgress);
      }
    };
  }, [selectedVideo]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleSeek = (e) => {
    const video = videoRef.current;
    const seekTime = (e.target.value / 100) * video.duration;
    video.currentTime = seekTime;
    setProgress(e.target.value);
  };

  return (
    <div className="video-container">
      <video ref={videoRef} className="_data" onClick={togglePlay}>
        <source src={selectedVideo} />
        Your browser does not support the video tag.
      </video>
      <div className="controls">
        <button className="play-pause" onClick={togglePlay}>
          <span>{isPlaying ? "Pause" : "Play"}</span>
        </button>
        <input
          type="range"
          className="seek-bar"
          min="0"
          max="100"
          value={progress}
          onChange={handleSeek}
        />
        <button className="mute-unmute" onClick={toggleMute}>
          {isMuted ? "Unmute" : "Mute"}
        </button>
      </div>
    </div>
  );
}

export default VideoPlayer;
