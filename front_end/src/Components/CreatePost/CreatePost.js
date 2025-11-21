
import { useState,useContext } from "react";
import { UserContext } from "../../Context/UserContext";
import { FaVideo } from "react-icons/fa";
import { HiMiniPhoto } from "react-icons/hi2";
import { MdOutlineGroupAdd } from "react-icons/md";
import { MdOutlineEvent } from "react-icons/md";
import pf from "../../Assets/pf.png"
import img03 from '../../Assets/img3.png'
import { PostContext } from "../../Context/PostContext";

const CreatePost = () => {
    const [postContent, setPostContent] = useState('');
    const { setUser, user, handleProfile, isModalOpen, setIsModalOpen } = useContext(UserContext)
    const {text,setText,images,setImages,videos,setVideos,setDisplayMedia,displayMedia} = useContext(PostContext);
    
    const handlePostSubmit = () => {
      console.log('Posting:', postContent);
      setPostContent('');
    };

    const func = () => {
      setText("")
      setDisplayMedia([]);
      setImages([]);
      setVideos([]);
       setIsModalOpen(true);
    };
    

    return (
      <div className="post-card"  >
        <div className="post-content">
          <div className="input-section" style={{paddingTop:"10px"}}>
            <div className="avatar" style={{marginLeft:"10px"}}>
              <img src={user?.avatar|| img03} alt="User" className="avatar-image02" style={{width:"45px",height:"45px"}}/>
            </div>
            <input
              type="text"
              className="post-input"
              placeholder="Share your thoughts..."
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              onClick={() => setIsModalOpen(true)}
            />
          </div>
          <div className="action-section">
            <div className="icon-buttons">
              <button className="icon-button" onClick={func}>
                <HiMiniPhoto className="icon" />
                Photo
              </button>
              <button className="icon-button" onClick={func}>
                <FaVideo className="icon" />
                Video
              </button>
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
              className={`post-submit-button ${!postContent.trim() ? 'disabled' : ''}`}
              onClick={handlePostSubmit}
              disabled={!postContent.trim()}
            >
              Post
            </button>
          </div>
        </div>
      </div>
    );
  }

  export default CreatePost