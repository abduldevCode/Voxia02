// StoryViewer.js
import React, { useState, useEffect } from 'react';
import img01 from "../../Assets/img01.png"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, prefix } from '@fortawesome/free-solid-svg-icons';
import { FaChevronLeft } from "react-icons/fa";
import { FaAngleRight } from "react-icons/fa6";

function StoryViewer({ stories, onClose, currentIndex, setIndex }) {

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
        }, 40);

        return () => clearInterval(timer);
    }, [progress, currentIndex, stories.length, onClose]);



    const forward = () => {
        if (currentIndex < stories.length - 1) setIndex(pre => pre + 1); setProgress(0)
    }

    const backward = () => {
        if (currentIndex > 0) setIndex(pre => pre - 1); setProgress(0)
    }


    const currentStory = stories[currentIndex]; console.log("curr", currentStory)
    const truncateWords = (text = "", limit = 30) => {
        const words = text.split(/\s+/);
        if (words.length <= limit) return text;
        return words.slice(0, limit).join(" ") + "...";
      };

    return (

        <div className="story-viewer-overlay">

            <h1 style={{ color: "white" }} className='left-hand' onClick={backward}><FaChevronLeft /></h1>
            <div className="story-viewer-container">
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '1px',
                        backgroundColor: '#e5e7eb', 
                    }}
                >
                    <div
                        style={{
                            height: '5px',
                            backgroundColor: 'white', 
                            width: `${progress}%`,
                        }}
                    />
                </div>
                <div
                    style={{
                        position: 'absolute',
                        top: '40px',
                        left: 0,
                        right: 0,
                        height: '1px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between', 
                        padding: '0 15px', 
                    }}
                >
                    <div className='stack'>
                        <img src={currentStory.user.avatar || img01} alt={img01} className="avatar03" style={{ marginRight: "10px" }} />
                        <p style={{ margin: 0 }} className="st-img" >{currentStory.user.username}</p> 
                    </div>
                    <p style={{ margin: 0, cursor: "pointer", color: "grey", fontSize: "20px" }} onClick={onClose}><FontAwesomeIcon icon={faTimes} /></p> {/* Right-aligned */}
                </div>



                {
                    currentStory?.text ? (
                        <div className="story-viewer-text" >
                            <p style={{fontSize:"20px"}}>{truncateWords(currentStory.text, 30)}</p>
                        </div>
                    ) : currentStory?.video ? (
                        <video
                            src={currentStory.video}
                            className="story-viewer-image"
                            autoPlay
                            controls 
                        />
                    ) : (
                        <img
                            src={currentStory.image}
                            alt={currentStory?.user?.username || "story"}
                            className="story-viewer-image"
                        />
                    )
                }

            </div>
            <h1 style={{ color: "white" }} className='right-hand ' onClick={forward}><FaAngleRight /></h1>

        </div>



    );
}

export default StoryViewer;
