import React, { useState, useRef } from "react";
import "./VideoPlayer.css";

const VideoPlayer = ({ videoUrl }) => {
  const [playing, setPlaying] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(false);
  const videoRef = useRef(null);


  const togglePlayPause = () => {
    if (playing) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setPlaying(!playing);
  };

  const handleVideoClick = () => {
    setControlsVisible(true);
  };

  const hideControls = () => {
    setTimeout(() => {
      setControlsVisible(false);
    }, 3000); 
  };

  return (
    <div className="video-container" onClick={handleVideoClick}>
      <div className="video-wrapper">
        <video
          ref={videoRef}
          className="video-player"
          src={videoUrl}
          onClick={(e) => e.stopPropagation()} 
          onPause={() => setPlaying(false)}
          onPlay={() => setPlaying(true)}
          onMouseMove={hideControls} 
        />
     
        {controlsVisible && (
          <div className="controls-wrapper">
            <button className="play-pause-button" onClick={togglePlayPause}>
              {playing ? "Pause" : "Play"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;

