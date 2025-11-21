import { useContext,useEffect } from "react";
import { UserContext } from "../../Context/UserContext";
import { useNavigate } from "react-router-dom";


import { FaUserFriends } from "react-icons/fa";
import { MdEventNote } from "react-icons/md";
import { IoNotificationsCircle } from "react-icons/io5";
import { MdGroupAdd } from "react-icons/md";
import defaul from "../../Assets/defaul.png";
import def2 from "../../Assets/deff.png";

const LeftSidebar = () => {
    const navigate = useNavigate()
    const { setUser, user, handleProfile } = useContext(UserContext)
  
  
    useEffect(() => {
      handleProfile()
    }, [])
  
    return (
      <div className="left-sidebar" >
        <div className="profile-card" onClick={() => navigate(`/profile/${user._id}`)}>
          <div className="profile-cover">
            <img src={user?.coverimage||def2 } alt="Background" className="bg-image"  />
            <img src={user?.avatar ||defaul } alt="Profile" className="profile-image" />
          </div>
          <div className="profile-info">
            <h2 className="profile-name">{user?.fullname}</h2>
            <p className="profile-title">Web Developer at Webestica</p>
            
            <div style={{ color: "#333", width: "100%", borderTop: "1px solid lightgrey" ,marginTop:"20px"}}></div>

            <div className="profile-stats">
              <div>
              <div className="stat-count">{user?.posts}</div>
                <div className="stat-label">Posts</div>
              </div>
              <div>
                <div className="stat-count">{user?.followerCount}</div>
                <div className="stat-label">Followers</div>
              </div>
              <div>
                <div className="stat-count">{user?.followingCount}</div>
                <div className="stat-label">Followings</div>
              </div>
            </div>
          </div>
        </div>
        <div className="sidebar-buttons">
  
          <button className="sidebar-button">
            <FaUserFriends className="icon" /> Connections
          </button>
          <button className="sidebar-button">
            <MdEventNote className="icon" /> Events
          </button>
          <button className="sidebar-button">
            <MdGroupAdd className="icon" /> Groups
          </button>
          <button className="sidebar-button">
            <IoNotificationsCircle className="icon" /> Notifications
          </button>
  
        </div>
        <div className='profile'>
          <button className="view-profile">View Profile</button>
        </div>
  
      </div>
    )
  };
  
export default LeftSidebar