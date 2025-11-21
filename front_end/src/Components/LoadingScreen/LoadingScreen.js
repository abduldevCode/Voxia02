
import React from 'react';
import './Loading.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';

const LoadingScreen = () => {
  return (
    <div className="loading-container">
      <h1 className="logo">
        <span className="logo-blue">vox</span>ia<span className="dot" />
      </h1>
      <p className="subtitle">Connect. Share. Discover.</p>
      <div className="loader">
        <FontAwesomeIcon icon={faCircleNotch} spin className="spinner" />
        <span>Connecting to Voxia
            ...</span>
      </div>
    </div>
  );
};

export default LoadingScreen;
