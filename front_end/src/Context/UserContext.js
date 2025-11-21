import React, { createContext, useEffect, useState } from 'react';
import { toast } from "react-hot-toast";
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('CurrProfiler')) || null)
    const [userDetail, setUserDetail] = useState(null)
    const [loader, setLoader] = useState(false)
    const [listFollow, setFollowList] = useState([])
    const [loadUser, setLoadUser]=useState(true)

    const handleProfile = async () => {
        try {
            const token = localStorage.getItem('authToken');

            const response = await fetch("http://localhost:8000/api/v1/users/getUserProfile", {
                method: 'GET', 
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, 
                }
            });

            if (!response.ok) {
                throw new Error('Network response was not ok (frontend)');
            }

            const data = await response.json();
            localStorage.setItem('CurrProfiler', JSON.stringify(data.data));
            setUser(data.data)
            console.log("data", data.data);

        } catch (error) {
            console.error('fetch error in: (frontend)', error);

        }
    };

    const getUser = async (userId) => {
        const id = userId;
        const token = localStorage.getItem('authToken');
        try {
            const response = await fetch("http://localhost:8000/api/v1/users/FetchProfile", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, 
                },
                body: JSON.stringify({ id })
            });
            const data = await response.json();
            console.log("get profile", data)
            setUserDetail(data.data);
        } catch (error) {
            console.error('fetch error in: (frontend)', error);
        }
    };

    const editProfile = async () => {

        const formData = new FormData();
        let username = "ali"
        formData.append('username', username);
        const token = localStorage.getItem('authToken');
        setLoader(true); // Start loader

        try {
            const response = await fetch("http://localhost:8000/api/v1/users/updateProfile", {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`, 

                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Success:', data.data); 
            } else {
                const errorData = await response.json();
                console.error('Error:', errorData); 
            }
        } catch (error) {
            console.error('Error:', error.message); 
        } finally {
            setLoader(false);
        }
    };

    const GetFollowList = async () => {
        setLoadUser(false)
        const token = localStorage.getItem('authToken');
        try {
            const response = await fetch("http://localhost:8000/api/v1/users/getuser", {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log("follow list is ", data.data)
                setLoadUser(true)
                setFollowList(data.data)
            }

        } catch (error) {
            console.error("fetch follow list error", error);
        }
    }

    
    const FollowFunc = async (userId) => {
        try {
            console.log("Attempting to follow/unfollow user with id:", userId);
            const token = localStorage.getItem("authToken");

            const response = await fetch("http://localhost:8000/api/v1/users/followUser", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ userId })
            });

            if (response.ok) {
                const data = await response.json();
                console.log("follow is ", data)
                setFollowList((users) => users.map((user) => user._id === userId ? { ...user, isFollowed: !user.isFollowed } : user));
                if (data.data.status) {
                    toast(`You Followed ${data.data.username} !`,
                        {
                            icon: '👏',
                            style: {
                                borderRadius: '10px',
                                background: '#333',
                                color: '#fff',
                            },
                        }
                    );
                }
            }
        } catch (error) {
            console.error("Error while following/unfollowing:", error);
        }
    };

    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

    const handleEditProfileClick = () => {
        setIsEditProfileOpen(true);
    };

    const handleCloseForm = () => {
        setIsEditProfileOpen(false);
    };

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [isModal, setIsModal] = useState(false)
   

    const StoryOpen = () => {
        setIsModal(true);
        console.log("great")
    };

    const StoryClose = () => {
        setIsModal(false);
    };

    return (
        <UserContext.Provider value={{
            user,
            setUser,
            handleEditProfileClick,
            handleCloseForm,
            isEditProfileOpen,
            handleProfile,
            getUser,
            setUserDetail,
            userDetail,
            editProfile,
            isModalOpen,
            setIsModalOpen,
            isModal,
            setIsModal,
            StoryOpen
            , StoryClose,
            listFollow, setFollowList,
            GetFollowList
            , FollowFunc,loadUser , StoryClose
        }}>
            {children}
        </UserContext.Provider>
    );
};
