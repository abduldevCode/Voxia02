import { Cone } from 'lucide-react';
import React, { createContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {

    const [Chats, setChats] = useState([]);
    const [messages, setMessage] = useState([])
    const [newMessage, setNewMessage] = useState("")

    const [notification, setNotification] = useState([])
    const [createNotify, setCreateNotify] = useState(null)

    const [selectedChat, setSelectedChat] = useState({})
    const [search, setSearch] = useState("")
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [displayNew, setDisplayNew] = useState({})
    const [socketConnected, setSocketConnect] = useState(false)
    const [loadChat, setLoadChat] = useState(true)

    const socket = io("http://localhost:8000");
    const user = JSON.parse(localStorage.getItem('CurrProfiler'));
    const currProfiler = JSON.parse(localStorage.getItem('CurrProfiler'));


    useEffect(() => {
        const handleCommunication = () => {
            setSocketConnect(true)
        }
        if (user) {
            socket.emit("setup", user);
            socket.emit("userOnline", user._id); // Send user ID after login
            socket.on("communication", handleCommunication);
        }
        return () => socket.off("communication", handleCommunication)
    }, [user]);

    const getChats = async () => {

        const token = localStorage.getItem('authToken');
        try {
            const response = await fetch("http://localhost:8000/api/v1/users/GetAllChat", {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log("chats are ", data.data)
                setChats(data.data)

            }

        } catch (error) {
            console.error("Error fetching chats: ", error);
        }
    }

    const AccessChat = async (userId) => {
        setLoadChat(false)
        const token = localStorage.getItem('authToken');
        try {
            const response = await fetch("http://localhost:8000/api/v1/users/AccessChat", {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId })
            })

            if (response.ok) {
                const data = await response.json();
                console.log("accesschat", data);


                if (Array.isArray(data.data) && data.data.length > 0) {
                    const newchat = Chats.find((chat) => data.data[0]._id === chat._id);
                    setSelectedChat(data.data)
                    if (!newchat) {
                        setChats((prevChats) => [...prevChats, ...data.data]);
                    } else {
                        console.log("Chat already exists");
                    }
                } else if (data.data && typeof data.data === 'object') {
                    const newchat = Chats.find((chat) => data.data._id === chat._id);
                    setSelectedChat([data.data])
                    if (!newchat) {
                        setChats((prevChats) => [...prevChats, data.data]); // Add the object directly
                    } else {
                        console.log("Chat already exists");
                    }
                } else {
                    console.log("data is invalid or empty", data.data);
                }

                setLoadChat(true)
            } else {
                console.log("Error: wrong , wrong , wrong")
            }



        } catch (error) {
            setLoadChat(true)
            console.error("error is", error)
        }
    }

    const AccessMessages = async () => {
        let chatIds = selectedChat[0];
        let chatId = chatIds._id
        const token = localStorage.getItem('authToken');

        try {
            const response = await fetch("http://localhost:8000/api/v1/users/GetAllMessage", {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ chatId })
            })

            if (response.ok) {
                const data = await response.json();
                console.log("massages are ", data.data)
                setMessage(data.data);
                socket.emit("join chat", chatId)
            }

        } catch (error) {
            console.error("error is", error)
        }

    }

    const SendMessage = async () => {
        if (!newMessage || newMessage.trim() === '') return;
        console.log(" start delivering ")
        let content = newMessage;
        let chatIds = selectedChat[0];
        let id = chatIds._id
        const token = localStorage.getItem('authToken');
        try {
            const response = await fetch(`http://localhost:8000/api/v1/users/CreateMessage/${id}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content })

            })
            if (response.ok) {
                const data = await response.json();
                console.log("new message is ", data);
                socket.emit("new message", data.data)

                setMessage((prev) => {
                    if (!Array.isArray(prev)) {
                        return [data.data];  
                    }
                    return [...prev, data.data];  
                });

                setNewMessage("")



                const getChat = Chats.find(chat => chat._id === id);

                if (getChat) {
                    setChats((prevChats) => {
                        // Remove the old version of this chat
                        const filteredChats = prevChats.filter(chat => chat._id !== getChat._id);
                        // Add updated one at the top
                        return [getChat, ...filteredChats];
                    });
                }
            }

        } catch (error) {
            console.error("error is ", error)
        }

    }

    const searchUser = async () => {
        const token = localStorage.getItem('authToken');
        try {
            const response = await fetch(`http://localhost:8000/api/v1/users?search=${search}`
                , {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },

                })
            if (response.ok) {
                const data = await response.json(); console.log("user is", data)
                setFilteredUsers(data)
            }

        } catch (error) {
            console.error("error is ", error)
        }
    }

    const checkUser = (username) => {
        if (!username) return false
        return currProfiler.username === username
    }

    const displayUser = (userArray) => {
        // method1
        let result = userArray?.map(user => {
            if (currProfiler?.username !== user?.username) {
                return user?.username
            }
        });
        return result
        //method2
        // return  currProfiler.username===userArray[0].username?userArray[1].username:userArray[0].username
    }

    const fetchNotifications = async () => {
        const token = localStorage.getItem('authToken');
        try {
            const response = await fetch("http://localhost:8000/api/v1/users/getNotifications", {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            if (response.ok) {
                const data = await response.json();
                console.log("notifications are ", data.data)
                setNotification(data.data)
            }
        } catch (error) {
            console.error("Error fetching notifications:", error);
            ////setLoading(false);
            //////
            //////
            /////
            /////
            ////
            /////

        }
    };

    const createNotification = async () => {
        const token = localStorage.getItem('authToken');
        try {
            const response = await fetch("http://localhost:8000/api/v1/users/CreateNotify", {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(createNotify)
            })

            if (response.ok) {
                const data = await response.json();
                console.log("notification is ", data.data)
                socket.emit("new notification", data.data);
            }

        } catch (error) {
            console.error("Error is:", error);
            if (error instanceof Error) {
                console.error("Error message:", error.message);
            }
            console.error("Network request failed:", error);
        }

    }

    useEffect(() => {
        if (selectedChat[0] && selectedChat[0]._id) {
            AccessMessages()
        }
    }, [selectedChat])


    useEffect(() => {
        fetchNotifications()
        socket.on("notification received", (notification) => {
            console.log("this is you want ", notification)
            setNotification((previousNotification) => [notification, ...previousNotification])
        });
        return () => {
            socket.off("notification received");
        };
    }, [])


    /* func()
     like post api call
     change the liked states
      emit the liked notification 
    */



    useEffect(() => {
        if (createNotify) {
            createNotification()
        }
    }, [createNotify])

    useEffect(() => {
        console.log("ouput01")
        socket.on("message recieved", (newMessageRecieved) => {
            console.log("output02")
            if (!selectedChat || !selectedChat[0] || selectedChat[0]._id !== newMessageRecieved.chat._id) {
                if (!socketConnected) return
                const statusExist = notification.find((notify) => notify.chatId === newMessageRecieved.chat._id);
                if (!statusExist) {
                    const object = {
                        eventType: "newMessage",
                        senderid: newMessageRecieved.sender._id
                    }
                    setCreateNotify(object)
                }
                const getChat = Chats.find(chat => chat._id === newMessageRecieved.chat._id);

                if (getChat) {
                    setChats((prevChats) => {
                        const filteredChats = prevChats.filter(chat => chat._id !== getChat._id);
                        return [getChat, ...filteredChats];
                    });
                }
                
            }
            else {
                
                const getChat = Chats.find(chat => chat._id === newMessageRecieved.chat._id);

                if (getChat) {
                    setChats((prevChats) => {
                        const filteredChats = prevChats.filter(chat => chat._id !== getChat._id);
                        return [getChat, ...filteredChats];
                    });
                }
                
                setMessage((prev) => [...prev, newMessageRecieved]);

            }
        })
        return () => {
            socket.off("message recieved");
        };
    });



    return (
        <ChatContext.Provider value={{
            getChats,
            Chats,
            selectedChat, loadChat, setLoadChat,
            setSelectedChat,
            AccessChat,
            messages, fetchNotifications,
            setMessage, displayUser,
            newMessage, setNewMessage, notification, setNotification,
            SendMessage, search, setSearch, filteredUsers, setFilteredUsers, searchUser, checkUser
        }}>
            {children}
        </ChatContext.Provider>
    );
};
