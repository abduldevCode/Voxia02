import React, { useState } from 'react';
import './Pf.css'; // For styling

import { FaVideo } from "react-icons/fa";
import { HiMiniPhoto } from "react-icons/hi2";
import { MdOutlineGroupAdd } from "react-icons/md";
import { MdOutlineEvent } from "react-icons/md";

function PostForm() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [mediaFiles, setMediaFiles] = useState([]); 
    const [text, setText] = useState('');


    const handleOpenModal = () => setIsModalOpen(true);

    const handleCloseModal = () => {
        setIsModalOpen(false);
        mediaFiles.forEach(file => URL.revokeObjectURL(file.previewUrl));
        setMediaFiles([]);
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        const newFiles = files.map(file => ({
            file,
            previewUrl: URL.createObjectURL(file)
        }));
        setMediaFiles((prevFiles) => [...prevFiles, ...newFiles]);
    };

    const handleRemoveMedia = (index) => {
        URL.revokeObjectURL(mediaFiles[index].previewUrl); 
        setMediaFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };


    const handlePost = () => {
        console.log('Text:', text);
        console.log('Media files:', mediaFiles);
        handleCloseModal();
    };

    return (
        <div className="post-form-container">
            <button onClick={handleOpenModal} className="open-modal-btn">Create Post</button>

            {isModalOpen && (
                <div className="modal-background" onClick={handleCloseModal}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
      
                        <div className="modal-header">
                            <span className="close-btn" onClick={handleCloseModal}>&times;</span>
                        </div>

                        <textarea
                            className="post-text-input"
                            placeholder="What's on your mind?"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            rows={3}
                        />

                        <div className="media-preview-area">
                            {mediaFiles.map((media, index) => (
                                <div key={index} className="media-item">
                                    {media.file.type.startsWith('image') ? (
                                        <img src={media.previewUrl} alt="selected-media" />
                                    ) : (
                                        <video src={media.previewUrl} controls />
                                    )}
                                    <span className="remove-media" onClick={() => handleRemoveMedia(index)}>&times;</span>
                                </div>
                            ))}
                        </div>

                   

                        <div className="action-section">
                            <div className="icon-buttons">
                                <label className="icon-button">
                                    <HiMiniPhoto className="icon" />
                                    Photo
                                    <input type="file" accept="image/*" onChange={handleFileChange} multiple hidden />
                                </label>
                                <label className="icon-button">
                                    <FaVideo className="icon" />
                                    Video
                                    <input type="file" accept="video/*" onChange={handleFileChange} multiple hidden />
                                </label>
                                <button className="icon-button">
                                    < MdOutlineEvent className="icon" />
                                    Event
                                </button>
                                <button className="icon-button">
                                    <MdOutlineGroupAdd className="icon" />
                                    Group
                                </button>
                            </div>
                            <button
                                className={`post-submit-button `}
                                onClick={handlePost}
                            >
                                Post
                            </button>
                        </div>


                    </div>
                </div>
            )}
        </div>
    );
}

export default PostForm;
