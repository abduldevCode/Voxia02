import React, { useEffect } from 'react';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faMagnifyingGlass, faBell, faHome, faEnvelope, faUser } from '@fortawesome/free-solid-svg-icons';
import { IoPersonCircle } from "react-icons/io5";
import { PostContext } from '../../Context/PostContext';
import { MdOutlineCloseFullscreen } from "react-icons/md";
import { TbDotsVertical } from "react-icons/tb";
import img02 from "../../Assets/img02.png";
import { useContext } from 'react';
import { ChatContext } from '../../Context/ChatContext';
import './Nav.css';
import { IoHomeOutline } from "react-icons/io5";
import { FiMessageSquare } from "react-icons/fi";
import { FaUserFriends } from "react-icons/fa";
import { GoPeople } from "react-icons/go";
import { BsChatLeftText } from "react-icons/bs";
import { IoMdNotificationsOutline } from "react-icons/io";
import { BsEnvelopeArrowUp } from "react-icons/bs";
import { StoryContext } from '../../Context/StoryContext';
import { LiaTimesSolid } from "react-icons/lia";
import { Link } from 'react-router-dom';
import { FaUser, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Context/AthContext'
import NotificationsIcon from '@mui/icons-material/Notifications';
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';

const notifications = [

  {
    _id: "1",
    sender: {
      username: "john_doe",
      avatar: img02
    }
  },
  {
    _id: "2",
    sender: {
      username: "jane_smith",
      avatar: img02
    }
  },
  {
    _id: "3",
    sender: {
      username: "alice_williams",
      avatar: img02
    }
  }
]





function UserMenu() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }
  const user = JSON.parse(localStorage.getItem('CurrProfiler'));

 const {logout} = useContext(AuthContext);

   

  const { notification, setNotification } = useContext(ChatContext)

  const [showNotifications, setShowNotifications] = useState(false);
 
  /*
    const handleFollow = (userId) => {
      setUsers((prevUsers)=>prevUsers.map((user)=>user.id===userId?{...user,followed:!user.followed}:user))
      console.log(`Followed user with id ${userId}`)
    }  */


  const toggleNotificationList = () => {
    setShowNotifications(!showNotifications);
  };


  // read all notifications when showNotifications is true
  useEffect(() => {
    console.log("bingo")
    if (showNotifications && notification.filter(notify => notify.isRead === false).length > 0) {
      readAllNotifications();
    }
  }, [showNotifications, notification]);


  const readAllNotifications = async () => {
    console.log("Read all notifications");
    const token = localStorage.getItem('authToken');
    try {
      const response = await fetch("http://localhost:8000/api/v1/users/readAllNotification", {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json();
        console.log("All Notification read successfully ", data.data)
        const updatedNotifications = notification.map(notify => ({ ...notify, isRead: true }))
        setNotification(updatedNotifications)
      }
    } catch (error) {
      console.error("failed to read", error);
    }
  };


  return (
    <div className="user-menu">
      <button onClick={toggleMenu} className="user-menu-button">
        <img src={user?.avatar|| img02} alt="User avatar" className="user-avatar" />
      </button>
      {isOpen && (
       <div className="user-menu-dropdown">
       <a href="/main"
        className="user-menu-item">
         <FaUser style={{fontSize:"12px",marginRight:"5px",color:"#3498db"}} /> Your Profile
       </a>
       <a href="/main"
        className="user-menu-item">
         <FaCog  style={{fontSize:"12px",marginRight:"5px",color:"#3498db"}}/> Settings
       </a>
       <p
        className="user-menu-item" onClick={ logout}
       >
         <FaSignOutAlt style={{fontSize:"12px",marginRight:"5px",color:"#3498db"}}/> Sign out
       </p>
     </div>
      )}
    </div>
  )
}




















const Navbar = () => {


  const { notification, setNotification,setSelectedChat ,selectedChat,AccessChat,fetchNotifications} = useContext(ChatContext)
  const {query, setQuery}=useContext(PostContext);

  
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate=useNavigate()

  const toggleNotificationList = () => {
    setShowNotifications(!showNotifications);
  };


  useEffect(() => { console.log('hello')
    if (showNotifications && notification.filter(notify=>notify.isRead===false).length>0) { // 
      readAllNotifications();
    }
  }, [showNotifications, notification]);


  const readAllNotifications = async () => {
    console.log("Read all notifications");
    const token = localStorage.getItem('authToken');
    try {
      const response = await fetch("http://localhost:8000/api/v1/users/readAllNotification", {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json();
        console.log("All Notification read successfully ", data.data)
        const updatedNotifications = notification.map(notify => ({ ...notify, isRead: true }))
        setNotification(updatedNotifications)
      }
    } catch (error) {
      console.error("failed to read", error);
    }
  };

 
  useEffect(()=>{
    fetchNotifications()
  },[]) 

 
  const GoToNotify=(data)=>{
    AccessChat(data.sender._id)
    navigate('/chat')
  }

 
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <Link to="/main" className="navbar-logo">
            VOXIA
          </Link>

          <div className="search-container">
            <div className="search-box">
              <input
                type="search"
                placeholder="Search"
                className="search-input"
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="navbar-right">
          <div className="navbar-links">
            <Link to="/main" className="navbar-link">
            <IoHomeOutline className='stp' /> <p style={{fontSize:"16px",fontWeight:"lighter"}}>Home</p> 
            </Link>

            <Link to="/fol" className="navbar-link">
              <GoPeople className='stp' />   <p style={{fontSize:"16px",fontWeight:"lighter"}}>Invites</p>
            </Link>

            <Link to="/chat" className="navbar-link">
              <BsEnvelopeArrowUp className='stp' />  <p style={{marginLeft:"3px",fontSize:"16px",fontWeight:"lighter"}}>Chats</p>
            </Link>
          </div>
          <button className="navbar-notifications">
            <div className="navbar-link">
            <div className="notification-container" onClick={toggleNotificationList}>
                <Badge sx={{
                  '& .MuiBadge-badge': {
                    backgroundColor: 'red',
                    color: 'white',
                  },
                }} badgeContent={notification.filter(notify => notify.isRead === false).length}>
                  <NotificationsIcon />
                </Badge>
              </div>

              {/* Notification List Modal */}
              {showNotifications && (
                <div className="notification-modal">
                  <div className='not-top'>
                    <p>Notification</p>
           
                      <Link to="/not" style={{fontSize:"14px"}}>
                        <MdOutlineCloseFullscreen />
                        </Link>
                
                  </div>
                  <div className="notification-list">

                    {notification?.map((notification) => (
                      <div className="notification-item" key={notification._id}  onClick={()=>GoToNotify(notification)}>
                        <div className='keeps'>
                          <img src={notification?.sender?.avatar} className="notification-avatar" />
                          <div>
                            <p>{notification?.sender?.username}</p>
                            <p>send you a new massage</p>
                          </div>
                        </div>
                        <LiaTimesSolid className='menu09'
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </button> 
          <UserMenu />
        </div>
      </div>
    </nav>
  )
}






export default Navbar;
