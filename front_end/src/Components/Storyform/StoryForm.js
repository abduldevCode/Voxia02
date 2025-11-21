import { useContext, useState, useEffect } from "react";
import { HiMiniPhoto } from "react-icons/hi2";
import { UserContext } from "../../Context/UserContext";
import { FaVideo } from "react-icons/fa";
import { FaPenToSquare } from "react-icons/fa6";
import img04 from '../../Assets/img04.png'
import { RiDeleteBin6Line } from "react-icons/ri";
import { StoryContext } from "../../Context/StoryContext";

import "./StoryForm.css";


function StoryForm() {
    const { isModal, StoryClose } = useContext(UserContext);
    const { userStory, deleteStory, setStories, GetStories, Stories, setUserStory } = useContext(StoryContext);
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [displayInput, setDisplayInput] = useState(false)
    const [text, setText] = useState('');
    const [image, setImage] = useState(null)
    const [video, setVideo] = useState(null);


    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedVideo(null);
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleVideoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(null);
            const videoUrl = URL.createObjectURL(file);
            setSelectedVideo(videoUrl); 
            setImage(null); 
            setVideo(file); 
        }
    };


    const handleInputChange = (e) => {
        setText(e.target.value);
    };

    const getInput = () => {
        setDisplayInput(true)
    }

    const handleResetClick = () => {
        setSelectedImage(null)
        setSelectedVideo(null)
        setDisplayInput(false)
        setText("")
    };

    useEffect(() => {
        GetStories()
    }, [])

    const SubmitStory = async (e) => {

        e.preventDefault();

        const token = localStorage.getItem('authToken');
        const formData = new FormData();

        if (image) {
            formData.append("image", image);
        }
        if (video) {
            formData.append("video", video);
        }

        if (text) {
            formData.append("text", text);
        }


        for (let pair of formData.entries()) {
            console.log(pair[1]);
            console.log("its run")
        }
        try {
            const response = await fetch("http://localhost:8000/api/v1/users/addStory", {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error details:', errorData);
                throw new Error('Failed to create post');
            }

            handleResetClick()
            StoryClose()
            const data = await response.json();
            console.log("add ia ", data.data)

            const story = data.data
            setStories((pre) => [story, ...pre])
            setUserStory(data.data)

        } catch (error) {
            console.error('Error in submitStory function:', error);
        }
    };

    const truncateWords = (text = "", limit = 20) => {
        const words = text.split(/\s+/);
        if (words.length <= limit) return text;
        return words.slice(0, limit).join(" ") + "...";
      };

    return (
        isModal && (
            <div className="modal-background" onClick={StoryClose}>
                <div className="modal" onClick={(e) => e.stopPropagation()}>
                    {selectedImage && (
                        <>
                            <div className="modal-header" onClick={handleResetClick}>
                                <span className="close-btn">&times;</span>
                            </div>

                            <div className="dataSet">
                                <img src={selectedImage} alt="Selected" className="_data" />
                            </div>
                        </>
                    )}

                    {selectedVideo && (
                        <>
                            <div className="modal-header" onClick={handleResetClick}>
                                <span className="close-btn">&times;</span>
                            </div>

                            <div className="dataSet" >
                                <video className="_data" >
                                    <source src={selectedVideo} />
                                    Your browser does not support the video tag.
                                </video>
                            </div>
                        </>
                    )}

                    {displayInput && (
                        <>
                            <div className="modal-header" onClick={handleResetClick}>
                                <span className="close-btn">&times;</span>
                            </div>

                            <input
                                value={text}
                                onChange={handleInputChange}
                                className="input-field"
                                placeholder="What's on your mind?"
                            />
                        </>
                    )}


                    {userStory ?
                        <div class="cont-story">
                            <div class="story-title">
                                <p >MY Story</p>
                                <p style={{ color: "#3333336e" }}>12/3/24</p>


                            </div>
                            <div class="revise">
                                {
                                    userStory?.text ? (
                                        <div className="rev-text">
                                            <p>{truncateWords(userStory.text, 20)}</p>
                                        </div>
                                    ) : userStory?.video ? (
                                        <video
                                            src={userStory.video}
                                            className="rev-img"
                                            controls // optional
                                        />
                                    ) : (
                                        <img
                                            src={userStory.image}
                                            className="rev-img"
                                            alt="Story"
                                        />
                                    )
                                }

                                <button class="delete-icon" onClick={() => deleteStory(userStory._id)}>
                                    <RiDeleteBin6Line />
                                </button>
                            </div>
                        </div>
                        :
                        <div className="action-section">
                            <div style={{ display: "flex", gap: "20px" }}>
                                <label
                                    className={`icon-button ${(selectedImage || selectedVideo || displayInput) ? 'disabled' : ''}`}
                                >
                                    <HiMiniPhoto className="icon" />
                                    Photo
                                    <input
                                        type="file"
                                        accept="image/*"
                                        hidden
                                        onChange={handleImageChange}
                                        disabled={selectedImage || selectedVideo || displayInput}  // Disable the input
                                    />
                                </label>

                                <label
                                    className={`icon-button ${(selectedImage || selectedVideo || displayInput) ? 'disabled' : ''}`}
                                >
                                    <FaVideo className="icon" />
                                    Video
                                    <input
                                        type="file"
                                        accept="video/*"
                                        hidden
                                        onChange={handleVideoChange}
                                        disabled={selectedImage || selectedVideo || displayInput}  // Disable the input
                                    />
                                </label>

                                <label
                                    className={`icon-button ${(selectedImage || selectedVideo) ? 'disabled' : ''}`}
                                    onClick={getInput}
                                >
                                    <FaPenToSquare className="icon" />
                                    Text
                                </label>
                            </div>

                            <button
                                className="post-submit-button"

                                onClick={SubmitStory}
                            >
                                Post
                            </button>
                        </div>

                    }




                </div>
            </div>
        )
    );
}

export default StoryForm;
