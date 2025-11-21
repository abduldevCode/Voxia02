
import React, { useState, useEffect } from 'react';

function StoryView({ stories, onClose ,currentIndex,setIndex}) {

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      if (progress < 100) {
        setProgress((prev) => prev + 1);
      } else {
        if (currentIndex < stories.length - 1) {
          setIndex((prev) => prev + 1);
          setProgress(0);
        } else {
          onClose();
        }
      }
    }, 30);

    return () => clearInterval(timer);
  }, [progress, currentIndex, stories.length, onClose]);

  const currentStory = stories[currentIndex];

  return (
    <div className="story-viewer-overlay">
      <div className="story-viewer-container">
        <img
          src={currentStory.imageUrl}
          alt={`${currentStory.username}'s story`}
          className="story-viewer-image"
        />
        <div className="story-viewer-progress-bar">
          <div
            className="story-viewer-progress"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="story-viewer-header">
          <div className="story-viewer-avatar">
            <img
              src={currentStory.imageUrl}
              alt={currentStory.username}
              className="story-viewer-avatar-img"
            />
          </div>
          <span className="story-viewer-username">{currentStory.username}</span>
        </div>
        <button
          className="story-viewer-close-btn"
          onClick={onClose}
        >
          X
        </button>
      </div>
    </div>
  );
}

export default StoryView;
