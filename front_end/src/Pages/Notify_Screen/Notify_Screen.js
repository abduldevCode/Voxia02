import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import img02 from '../../Assets/img02.png';
import img04 from '../../Assets/img04.png';
import Navbar from '../../Components/Navbar/Navbar';
import { LiaTimesSolid } from "react-icons/lia";
import { FaBell, FaCommentAlt, FaUserPlus } from "react-icons/fa";
import { ToastContainer } from 'react-toastify';
import './Notify.css';


function getNotifications() {
    return [
        {
            id: "1",
            title: "New Message",
            message: "You have a new message from John Doe",
            time: "5 minutes ago",
            icon: "message",
            read: false,
            img: img02
        },
        {
            id: "2",
            title: "New Message",
            message: "Team standup in 15 minutes",
            time: "10 minutes ago",
            icon: "bell",
            read: false,
           img: img04
        },
        {
            id: "3",
            title: "New Connection",
            message: "Jane Smith accepted your connection request",
            time: "1 hour ago",
            icon: "user",
            read: true,
            img: img02
        },
        {
            id: "4",
            title: "New Message",
            message: "You have a new message from John Doe",
            time: "5 minutes ago",
            icon: "message",
            read: false,
            img: img04
        },
        {
            id: "5",
            title: "Meeting Reminder",
            message: "Team standup in 15 minutes",
            time: "10 minutes ago",
            icon: "bell",
            read: false,
            img: img02
        },
        {
            id: "6",
            title: "New Connection",
            message: "Jane Smith accepted your connection request",
            time: "1 hour ago",
            icon: "user",
            read: true,
            img: img02
        },
       
    ];
}




function NotificationList() {
    const notification=  [
        {
            id: "1",
            title: "New Message",
            message: "You have a new message from John Doe",
            time: "5 minutes ago",
            icon: "message",
            read: false,
            img: img02
        },
        {
            id: "2",
            title: "New Message",
            message: "Team standup in 15 minutes",
            time: "10 minutes ago",
            icon: "bell",
            read: false,
           img: img04
        },
        {
            id: "3",
            title: "New Connection",
            message: "Jane Smith accepted your connection request",
            time: "1 hour ago",
            icon: "user",
            read: true,
            img: img02
        },
        {
            id: "4",
            title: "New Message",
            message: "You have a new message from John Doe",
            time: "5 minutes ago",
            icon: "message",
            read: false,
            img: img04
        },
        {
            id: "5",
            title: "Meeting Reminder",
            message: "Team standup in 15 minutes",
            time: "10 minutes ago",
            icon: "bell",
            read: false,
            img: img02
        },
        {
            id: "6",
            title: "New Connection",
            message: "Jane Smith accepted your connection request",
            time: "1 hour ago",
            icon: "user",
            read: true,
            img: img02
        },
       
    ];
    const [notifications, setNotification ]=useState(notification)
   
       const Remov =( Id )=>{
        setNotification(
        notifications=>notifications.filter((notification)=>notification.id!==Id  )
       )
       }

    return (
        <ul className="notification-list09">
            <ToastContainer
              
            />
            {notifications.map((notification, index) => {
                const IconComponent = getIcon(notification.icon);

                return (
                    <motion.li
                        key={notification.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        className="notification-item09"
                    >
                        <div className="notification-content">
                           <img src={notification.img} alt={notification.alt} className="avatar039" />
                            <div className="notification-text09">
                                <p className="notification-title09">{notification.title}</p>
                                <p className="notification-message09">{notification.message}</p>
                                <p className="notification-time09">{notification.time}</p>
                            </div>
                            <LiaTimesSolid className='upc' onClick={()=>Remov(notification.id)}
                             />
                        </div>
                    </motion.li>
                );
            })}
        </ul>
    );
}

function getIcon(iconType) {
    switch (iconType) {
        case "message":
            return FaCommentAlt;
        case "bell":
            return FaBell;
        case "user":
            return FaUserPlus;
        default:
            return FaBell;
    }
}


function Avatar({ imageSrc, alt }) {
    return (
        <div className="avatarNot">
            <img src={imageSrc} alt={alt} className="avatar-img" />
        </div>
    );
}


export default function NotificationsPage() {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchNotifications = async () => {
            const notificationsData = await getNotifications();
            setNotifications(notificationsData);
        };
        fetchNotifications();
    }, []);

    return (
        <>
            <Navbar />
            <div className="notifications-page02">
                <h1 className="page-title">Notifications <FaBell  className='ups02'/></h1>
                <NotificationList notifications={notifications} />
            </div>
        </>
    );
}