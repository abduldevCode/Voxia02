
import React, { useEffect, useState } from 'react'
import { toast } from "react-hot-toast";
import { useContext } from 'react';
import { PostContext } from '../../Context/PostContext';
import { UserContext } from '../../Context/UserContext';
import { AuthContext } from '../../Context/AthContext';
import LeftSidebar from '../../Components/Left_bar/LeftBar';
import Stories from '../../Components/Stories/Stories';
import CreatePost from '../../Components/CreatePost/CreatePost';
import Navbar from '../../Components/Navbar/Navbar';
import { HiOutlineStatusOnline } from "react-icons/hi";
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import StoryForm from '../../Components/Storyform/StoryForm';
import Posts from '../../Components/Post-Comp/Post-Comp';
import img01 from '../../Assets/img01.png'
import img02 from '../../Assets/img02.png'
import img03 from '../../Assets/img3.png'
import img04 from '../../Assets/img04.png'
import "./Main.css"
import { HiMiniPhoto } from "react-icons/hi2";
import SearchResults from '../../Components/Navbar/Search';
import Skeleton from '@mui/material/Skeleton';
import { useNavigate } from 'react-router-dom';

/*
const suggestedUsers = [
  { _id: 1, name: 'Emma Watson', job: 'UX Designer', img: img04, isFollow: false },
  { _id: 2, name: 'Liam Payne', job: 'Software Engineer', img: img03, isFollow: false },
  { _id: 3, name: 'Olivia Rodriguez', job: 'Product Manager', img: img01, isFollow: false },
  { _id: 4, name: 'Noah Chen', job: 'Data Scientist', img: img02, isFollow: false },
  { _id: 5, name: 'Olivia Rodriguez', job: 'Product Manager', img: img03, isFollow: false },
  { _id: 6, name: 'Noah Chen', job: 'Data Scientist', img: img01, isFollow: false }, { _id: 7, name: 'Leon Keen', job: 'Data analyst', img: img03, isFollow: false },
  { _id: 7, name: 'Olivia Rodriguez', job: 'Product Manager', img: img03, isFollow: false },
  { _id: 8, name: 'Rahif', job: 'Data Scientist', img: img01, isFollow: false },
  { _id: 9, name: 'Asif ali', job: 'Data analyst', img: img03, isFollow: false },
];  */


export const SuggestToFollow = () => {
  const navigate = useNavigate()
  const { listFollow, setFollowList, GetFollowList, FollowFunc, loadUser

  } = useContext(UserContext)

  useEffect(() => {
    GetFollowList()
  }, [])


  const submit = (userId) => {
    FollowFunc(userId)
  }

  const Reject = (userId) => {
    setFollowList((users) => users.filter((user) => user?._id !== userId))
  }

  return (
    <div className="suggest-to-follow">
      <div className="card-header" >
        <p className="card-title" >Suggest to Follow</p>
        <p className="card-title" >See all</p>
      </div>
      <div className="card-content">
        {loadUser ?
          listFollow?.map((user) => (
            <div key={user?._id} className="user-item">
              <div className="user-info">
                <img src={user?.avatar || img02} alt={user.username} className="avatar009"
                  onClick={() => navigate(`/profile/${user._id}`)} />
                <div className="user-details">
                  <p className="user-name02">{user?.username}</p>
                  <p className="user-job">{user.job || "Gov Employee"}</p>
                </div>
              </div>

              <div className="geo">
                <button className="follow-button02" onClick={() => Reject(user?._id)} >Reject</button>
                <button className="follow-button"
                  onClick={() => submit(user._id)}> {user.isFollowed ? "Followed" : "Follow"}</button>
              </div>
            </div>
          ))
          :
          <> <Skeleton animation="wave" variant="rectangular" className="sty" height={45} />
            <Skeleton animation="wave" variant="rectangular" className="sty" height={45} />
            <Skeleton animation="wave" variant="rectangular" className="sty" height={45} />
            <Skeleton animation="wave" variant="rectangular" className="sty" height={45} />
            <Skeleton animation="wave" variant="rectangular" className="sty" height={45} />
            <Skeleton animation="wave" variant="rectangular" className="sty" height={45} />
          </>
        }
      </div>
    </div>
  );
}









const onlineFriends = [
  { id: 1, name: 'Alice Johnson', avatar: img01 },
  { id: 2, name: 'Bob Smith', avatar: img02 },
  { id: 3, name: 'Charlie Brown', avatar: img03 },
  { id: 4, name: 'Diana Prince', avatar: img04 },
  { id: 5, name: 'Ethan Hunt', avatar: img02 },
  { id: 6, name: 'Fiona Apple', avatar: img03 },

];

function OnlineFriends() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFriends = onlineFriends.filter(friend =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (


    <div className="friends-container">

      <div className="card-header" style={{ width: "90%", margin: "0 auto", marginTop: "20px", marginBottom: "5px" }}>
        <p className="card-title" style={{ color: "#66aaff" }}>Online Now </p>
        <HiOutlineStatusOnline className='geo2' />
      </div>
      <div className="friends-list">
        <ul>
          {filteredFriends.map(friend => (
            <li key={friend.id} className="friend-item">
              <div className="avatar-container03">
                <div className="avatar02">
                  <img src={friend.avatar} alt={friend.name} />
                </div>
                <span className="online-status"></span>
              </div>
              <div className="friend-info">
                <p className="friend-name02">{friend.name}</p>
                <p className="status">Online</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
























export function PostForm() {
  const { isModalOpen, setIsModalOpen } = useContext(UserContext);
  const { HandlePost,
    EditPost,
    postToEdit,
    setPostToEdit,
    setPosts,
    posts,
    deletPost,text,setText,images,setImages,videos,setVideos,setDisplayMedia,displayMedia

  } = useContext(PostContext);
  const { loading, setloading } = useContext(AuthContext);


  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  useEffect(() => {
    // Check if postToEdit exists and log its value
    console.log('postToEdit:', postToEdit);

    if (postToEdit) {
      if (postToEdit?.content) {
        setText(postToEdit.content);
      }

      if (postToEdit?.media) {

        const imageFiles = postToEdit.media.filter((file) =>
          file.match(/\.(jpeg|jpg|gif|png)$/i)
        );
        const videoFiles = postToEdit.media.filter((file) =>
          file.match(/\.(mp4|avi|mov|wmv)$/i)
        );

        // Log the filtered image and video files
        console.log("Image files:", imageFiles);
        console.log("Video files:", videoFiles);

        // Set the filtered image and video arrays to state
        setImages(imageFiles);
        setVideos(videoFiles);
        setDisplayMedia(postToEdit.media);




      }
    }


    /*
      let imagesfile=[]
      let videofile=[]
    postToEdit.media.forEach(media => {
      if(media.match(/\.(jpeg|jpg|gif|png)$/i)){
        imagesfile.push(media)
      }else if(media.match(/\.(mp4|avi|mov|wmv)$/i)){
        videofile.push(media)
      }
    });
    console.log("images are",imagesfile)
    console.log("videos are",videofile)
 
    setImages(imagesfile);
    setVideos(videofile);
    setDisplayMedia(postToEdit.media);*/
  }, [postToEdit]);



  function removeMedia(media) {
    const isUrl = typeof media === 'string';

    if (isUrl) {

      const fileExtension = media.split('.').pop().toLowerCase();

      if (['jpeg', 'jpg', 'gif', 'png'].includes(fileExtension)) {
        setImages((prevImages) => prevImages.filter(url => url !== media));
        setDisplayMedia((prevDisplayMedia) => prevDisplayMedia.filter(url => url !== media));
      } else if (['mp4', 'avi', 'mov', 'wmv'].includes(fileExtension)) {
        setVideos((prevVideos) => prevVideos.filter(url => url !== media));
        setDisplayMedia((prevDisplayMedia) => prevDisplayMedia.filter(url => url !== media));
      }

    } else {

      if (media.type.startsWith('image')) {

        setImages((prevImages) => prevImages.filter(image => image.name !== media.name));
        setDisplayMedia((prevDisplayMedia) => prevDisplayMedia.filter(file => file.name !== media.name));
      } else if (media.type.startsWith('video')) {

        setVideos((prevVideos) => prevVideos.filter(video => video.name !== media.name));
        setDisplayMedia((prevDisplayMedia) => prevDisplayMedia.filter(file => file.name !== media.name));
      }
    }
  }



  const handleSubmit = async (e) => {
    e.preventDefault();
    setloading(true)
    if (postToEdit?.content || postToEdit?.media) {
      const token = localStorage.getItem('authToken');
      const formData = new FormData();
      if (text) {
        formData.append('content', text);
      }
      if (images) {
        images?.forEach((image) => formData.append('image', image));
      }
      if (videos) {
        videos?.forEach((video) => formData.append('video', video));
      }

      if ((!text || text.trim() === "") && (!images || images.length === 0) && (!videos || videos.length === 0)) {
        setloading(false);
        alert("Please add some content, image, or video to post.");
        return;
      }



      console.log("Image files:", images);
      console.log("Video files:", videos);

      for (let pair of formData.entries()) {
        console.log(pair[1] + 'this is edit');
      }

      try {
        const response = await fetch(`http://localhost:8000/api/v1/users/updatePost/${postToEdit._id}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        })

        if (response.ok) {
          const data = await response.json();
          console.log("updated successfully ", data.data._id)
          setPosts((prevPosts) => prevPosts.map((post) => (post._id === data.data._id ? data.data : post)));
          setloading(false)
          setText('')
          setImages([])
          setVideos([])
          setDisplayMedia([])
        }

      } catch (error) {
        console.error("error is", error)
      }


    }
    else {
      const token = localStorage.getItem('authToken');
      const formData = new FormData();
      if (text) {
        formData.append('content', text);
      }
      if (images) {
        images?.forEach((image) => formData.append('image', image));
      }
      if (videos) {
        videos?.forEach((video) => formData.append('video', video));
      }

      for (let pair of formData.entries()) {
        console.log(pair[1]);
      }
      if ((!text || text.trim() === "") && (!images || images.length === 0) && (!videos || videos.length === 0)) {
        setloading(false);
        alert("Please add some content, image, or video to post.");
        return;
      }

      try {
        const response = await fetch("http://localhost:8000/api/v1/users/createPost", {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        })

        if (response.ok) {
          const data = await response.json();
          setPosts((prevPosts) => [data.data, ...prevPosts]);
          console.log("post create successfully ", data)
          setloading(false)
          setText('')
          setImages([])
          setVideos([])
          setDisplayMedia([])
        }

      } catch (error) {
        console.error("error is", error)
      }


    }
    setIsModalOpen(false);
  };


  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith('image')) {
        setImages((prevImages) => [...prevImages, file]);
        setDisplayMedia((prev) => [...prev, file]);
      } else if (file.type.startsWith('video')) {
        setImages("")
        setDisplayMedia("")
        setVideos((prevVideos) => [...prevVideos, file]);
        setDisplayMedia((prev) => [...prev, file]);
      }
    }
  };


  const deleteFunc = () => {
    deletPost(postToEdit?._id)
    handleCloseModal()
  }


  const isDisabled = videos.length === 1 || images.length === 5;
  return (
    isModalOpen && (
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
            {displayMedia.map((media, index) => (
              <div key={index} className="media-item">
                {typeof media === 'string' ? (

                  media.match(/\.(jpeg|jpg|gif|png)$/i) ? (
                    <img src={media} alt={`media-${index}`} />
                  ) : (
                    <video>
                      <source src={media} type="video/mp4" />
                    </video>
                  )
                ) : (

                  media.type.startsWith('image') ? (
                    <img src={URL.createObjectURL(media)} alt={`media-${index}`} />
                  ) : (
                    <video>
                      <source src={URL.createObjectURL(media)} type={media.type} />
                    </video>
                  )
                )}
                <span className="remove-media" onClick={() => removeMedia(media)}>&times;</span>
              </div>
            ))}
          </div>

          <div className="action-section">
            <div className='ring'
            >
              <label
                className={`icon-button ${isDisabled ? 'disabled' : ''}`}
                style={{ cursor: isDisabled ? 'not-allowed' : 'pointer' }}
              >
                <HiMiniPhoto className="icon" />
                Photo
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  hidden
                  onChange={handleFileSelect}
                  disabled={isDisabled}
                />
              </label>


              <label
                className={`icon-button ${isDisabled ? 'disabled' : ''}`}
                style={{ cursor: isDisabled ? 'not-allowed' : 'pointer' }}
              >
                <HiMiniPhoto className="icon" />
                Video
                <input
                  type="file"
                  accept="video/*"
                  multiple
                  hidden
                  onChange={handleFileSelect}
                  disabled={isDisabled}
                />
              </label>
            </div>


            <div className='ring'
            >
              <button className="post-submit-button" onClick={handleSubmit}>
                Post  {loading ? <FontAwesomeIcon icon={faSpinner} spin /> : <></>}
              </button>
              {postToEdit && (
                <button className="post-submit-button" onClick={deleteFunc}>
                  Delete
                </button>
              )}
            </div>

          </div>
        </div>
      </div>
    )
  );
}















export default function Main() {
  return (
    <div className="app">
      <Navbar />

      <div className="main-content" >

        <LeftSidebar />
        <main className="feed09" >

          <Stories />
          <CreatePost />
          <Posts />
        </main>

        <aside className="right-sidebar">
          <SuggestToFollow />
          <OnlineFriends />
        </aside>

      </div>
      <PostForm />
      <StoryForm />
      <SearchResults />
    </div>
  );
}

