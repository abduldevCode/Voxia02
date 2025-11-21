import React, { useState, useEffect, useRef } from 'react';
import { CiCircleChevLeft } from "react-icons/ci";
import { CiCircleChevRight } from "react-icons/ci";


const PostDetailScreen = ({
    isOpen,
    onClose,
    post,
    initialIndex = 0
}) => {

    const images = post?.media || [];
    const postData = post || {};

    const [currentImageIndex, setCurrentImageIndex] = useState(initialIndex);
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);
    const slideRef = useRef(null);
    const [showFullText, setShowFullText] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setCurrentImageIndex(initialIndex);
        }
    }, [isOpen, initialIndex]);


    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!isOpen) return;

            switch (e.key) {
                case 'Escape':
                    onClose();
                    break;
                case 'ArrowUp':
                    goToPreviousImage();
                    break;
                case 'ArrowDown':
                    goToNextImage();
                    break;
                case 'ArrowLeft':
                    goToPreviousImage();
                    break;
                case 'ArrowRight':
                    goToNextImage();
                    break;
                default:
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, currentImageIndex]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const goToNextImage = () => {
        if (currentImageIndex < images.length - 1) {
            setCurrentImageIndex(currentImageIndex + 1);
        }
    };

    const goToPreviousImage = () => {
        if (currentImageIndex > 0) {
            setCurrentImageIndex(currentImageIndex - 1);
        }
    };

    // Touch handling for mobile swipe
    const handleTouchStart = (e) => {
        setTouchStart({
            y: e.targetTouches[0].clientY,
            x: e.targetTouches[0].clientX
        });
    };

    const handleTouchMove = (e) => {
        if (!touchStart) return;

        setTouchEnd({
            y: e.targetTouches[0].clientY,
            x: e.targetTouches[0].clientX
        });
    };

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return;

        const yDiff = touchStart.y - touchEnd.y;
        const xDiff = touchStart.x - touchEnd.x;
        const minSwipeDistance = 50;

        // Determine if it's a vertical swipe
        if (Math.abs(yDiff) > Math.abs(xDiff) && Math.abs(yDiff) > minSwipeDistance) {
            if (yDiff > 0) {
                // Swiped up
                goToNextImage();
            } else {
                // Swiped down
                goToPreviousImage();
            }
        }

        setTouchStart(null);
        setTouchEnd(null);
    };

    if (!isOpen || !post) return null;


    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };


    const setTextLength = (text = "", limit = 30) => {
        const words = text.split(/\s+/);
        if (!showFullText && words.length > limit) {
            return words.slice(0, limit).join(" ") + "...";
        }
        return text;
    };
    

    return (
        <div className="post-detail-overlay">
            <div className="post-detail-container">
                <button className="close-button" onClick={onClose}>
                    X
                </button>

                {currentImageIndex > 0 && (
                    <button className="nav-button prev-button" onClick={goToPreviousImage}>
                        <CiCircleChevLeft size={50} />
                    </button>
                )}

                {currentImageIndex < images.length - 1 && (
                    <button className="nav-button next-button" onClick={goToNextImage}>
                        <CiCircleChevRight className='nav-button' />
                    </button>
                )}

                {images.length > 1 && (
                    <div className="image-counter">
                        <span>{currentImageIndex + 1}/{images.length}</span>
                    </div>
                )}

                <div
                    className="image-slides-container"
                    ref={slideRef}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    <div
                        className="image-slide"
                        style={{ transform: `translateY(-${currentImageIndex * 100}%)` }}
                    >
                        {images.map((media, index) => {
                            const isVideo = media.endsWith('.mp4');

                            return (
                                <div key={index} className="image-slide-item">
                                    {!isVideo &&
                                        <img
                                            src={media}
                                            alt={`Post media ${index + 1}`}
                                            className="detail-media"
                                        />
                                    }
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Post info */}
                {postData && (
                    <div className="post-info">
                        <div className="post-header09">
                            {postData.user && (
                                <>
                                    <img
                                        src={postData.user.avatar}
                                        alt={postData.user.username}
                                        className="profile-pic09"
                                    />
                                    <div className="user-info09">
                                        <span className="username005">{postData.user.username}</span>
                                        <span className="post-date005">{formatDate(postData.createdAt)}</span>
                                    </div>
                                </>
                            )}
                        </div>
                        <p className="caption" onClick={() => setShowFullText(!showFullText)} style={{ cursor: 'pointer' }}>
                            {setTextLength(postData.content, 30)}
                            {postData?.content.split(/\s+/).length > 30 && (
                                <span style={{ color: '#007bff', marginLeft: '5px' }}>
                                    {showFullText ? "Read less" : "Read more"}
                                </span>
                            )}
                        </p>

                        {/* Like count */}
                        {postData.likeCount > 0 && (
                            <div className="like-info">
                                <span>{postData.likeCount} likes</span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PostDetailScreen;