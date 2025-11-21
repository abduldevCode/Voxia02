import { useState, useEffect, useRef } from "react";
import { FaAngleLeft } from "react-icons/fa6";
import { FaAngleRight } from "react-icons/fa6";
import Cap from '../../Assets/Cap.png'
import Cap2 from '../../Assets/Cap2.png'
import img01 from '../../Assets/img01.png';
import img02 from '../../Assets/img02.png';
import img03 from '../../Assets/img3.png';
import img04 from '../../Assets/img04.png';
import StoryViewer from "../Story/StoryDetail";
import { UserContext } from "../../Context/UserContext";
import { useContext } from "react";
import { StoryContext } from "../../Context/StoryContext";
import Skeleton from '@mui/material/Skeleton';
import "./Stories.css"
import { ContactSupportOutlined } from "@mui/icons-material";

const Stories = () => {

    const { setIsModal, StoryOpen, StoryClose } = useContext(UserContext);
    const { Stories, GetStories, setStories, UserStory, loadSet } = useContext(StoryContext)
    const [isStoryViewerOpen, setIsStoryViewerOpen] = useState(false);
    const [selectedStoryIndex, setSelectedStoryIndex] = useState(0);
    const currProfiler = JSON.parse(localStorage.getItem('CurrProfiler'));


    const handleStoryClick = (index) => {
        setSelectedStoryIndex(index);
        setIsStoryViewerOpen(true);
    };

    const handleCloseStoryViewer = () => {
        setIsStoryViewerOpen(false);
    };

    const handleNextStory = () => { setSelectedStoryIndex((prev) => prev < Stories.length - 1 ? prev + 1 : prev) }

    const handlePreviousStory = () => { setSelectedStoryIndex((prev) => prev > 0 ? prev - 1 : prev) };


    const storiesContainerRef = useRef(null);
    const [showLeftButton, setShowLeftButton] = useState(false);
    const [showRightButton, setShowRightButton] = useState(true);


    const handleScroll = () => {
        const container = storiesContainerRef.current;
        if (container.scrollLeft > 0) {
            setShowLeftButton(true);  
        } else {
            setShowLeftButton(false);
        }

        if (container.scrollWidth - container.scrollLeft === container.clientWidth) {
            setShowRightButton(false); 
        } else {
            setShowRightButton(true);  
        }
    };

    const scrollLeft = () => {
        storiesContainerRef.current.scrollBy({ left: -150, behavior: "smooth" });
    };

    const scrollRight = () => {
        storiesContainerRef.current.scrollBy({ left: 150, behavior: "smooth" });
    };

    useEffect(() => {
        const container = storiesContainerRef.current;
        container.addEventListener('scroll', handleScroll);
        GetStories();
        return () => {
            container.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const truncateWords = (text = "", limit = 30) => {
        const words = text.split(/\s+/);
        if (words.length <= limit) return text;
        return words.slice(0, limit).join(" ") + "...";
      };

    return (
        <>
            <div className="stories-section">
                <p style={{ fontSize: "25px", marginBottom: "8px" }}>Stories</p>
                {showLeftButton && (
                    <button className="scroll-button left" onClick={scrollLeft}>
                        < FaAngleLeft />
                    </button>
                )}


                <div className="stories-container" ref={storiesContainerRef}>
   
                    <div className="add-story" onClick={StoryOpen} style={{ cursor: "pointer" }}>
                        <span className="plus-icon">+</span>
                    </div>

                    {loadSet ? (
                        Stories.map((story, index) => {
                            const currentUser = currProfiler?._id === story?.user?._id;
                            const usernameLabel = currentUser ? "You" : story.user.username;
                     
                            return (
                                <div key={story.user.username} className="story" onClick={() => handleStoryClick(index)}>

                             
                                    {story?.text ? (
                                        <div className="ad" style={{ cursor: "pointer" }}>
                                            <span className="og">
                                               {truncateWords(story.text, 30)}
                                            </span>

                                            <div className="story-gradient02"></div>

                                            <div className="avatar-container20">
                                                <img src={story.user.avatar || img02} className="avatar20" alt="avatar" />
                                            </div>

                                            <p className="story-nae">{usernameLabel}</p>
                                        </div>
                                    ) : (
                                     
                                        <>
                                            {story.video ? (
                                                <video src={story.video} className="story-image" />
                                            ) : (
                                                <img src={story.image} className="story-image" alt="story" />
                                            )}

                                            <div className="story-gradient"></div>

                                            <div className="avatar-container2">
                                                <img src={story.user.avatar || img02} className="avatar2" alt="avatar2" />
                                            </div>

                                            <p className="story-name">{usernameLabel}</p>
                                        </>
                                    )}
                                </div>
                            );
                        })
                    ) : (
               
                        <>
                            <Skeleton animation="wave" variant="rectangular" className="story" height={190} />
                            <Skeleton animation="wave" variant="rectangular" className="story" height={190} />
                            <Skeleton animation="wave" variant="rectangular" className="story" height={190} />
                            <Skeleton animation="wave" variant="rectangular" className="story" height={190} />
                        </>
                    )}
                </div>

                {showRightButton && (
                    <button className="scroll-button right" onClick={scrollRight}>
                        <FaAngleRight />
                    </button>
                )}
            </div>
            {isStoryViewerOpen &&
                <StoryViewer
                    stories={Stories}
                    currentIndex={selectedStoryIndex}
                    setIndex={setSelectedStoryIndex}
                    onClose={handleCloseStoryViewer}
                    onNext={handleNextStory} 
                    onPrevious={handlePreviousStory} 
                />
            }
        </>
    );
}

export default Stories