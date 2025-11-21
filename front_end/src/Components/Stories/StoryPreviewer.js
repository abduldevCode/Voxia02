
import React from 'react';

function StoryPreviewer({ imageUrl, username, onClick }) {
  return (
    <button
      className="story-preview-btn"
      onClick={onClick}
    >
      <div className="story-preview-image-container">
        <img
          src={imageUrl}
          alt={`${username}'s story`}
          className="story-preview-image"
        />
      </div>
      <span className="story-preview-username">{username}</span>
    </button>
  );
}

export default StoryPreviewer;
