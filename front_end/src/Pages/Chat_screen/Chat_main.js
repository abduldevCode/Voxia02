import ChatArea from "../../Components/ChatComp/ChatBox";
import ContactBar from "../../Components/ChatComp/ChatCont";
import Head from "../../Components/ChatComp/ChatHeader";
import OnFriends from "../../Components/ChatComp/ChatOnline";
import img02 from "../../Assets/img02.png"
import Navbar from "../../Components/Navbar/Navbar";
import ChatApp from "../../Components/ChatComp/Ctry";
import { ToastContainer } from "react-toastify";
import './Chat.css';
import { useEffect, useState } from "react";
import { ChatContext } from "../../Context/ChatContext";
import UserSearch from "../../Components/ChatComp/ChatSreach";
import { useContext } from "react";
const dataset = {
  contacts: [
    {
      id: 1,
      name: "Alice Johnson",
      avatar: img02,
      messages: [
        { id: 1, sender: "Alice", content: "Hey there! How are you?", timestamp: "10:00 AM" },
        { id: 2, sender: "You", content: "Hi Alice! I'm doing great, thanks for asking.", timestamp: "10:02 AM" },
        { id: 3, sender: "Alice", content: "Hey there! How are you?", timestamp: "10:00 AM" },
        { id: 4, sender: "You", content: "Hi Alice! I'm doing great, thanks for asking.", timestamp: "10:02 AM" },
        { id: 5, sender: "Alice", content: "Hey there! How are you?", timestamp: "10:00 AM" },
        { id: 6, sender: "You", content: "Hi Alice! I'm doing great, thanks for asking.", timestamp: "10:02 AM" }


      ]
    },
    {
      id: 2,
      name: "Bob Smith",
      avatar: img02,
      messages: [
        { id: 1, sender: "Bob", content: "Hello! What's up?", timestamp: "09:45 AM" },
        { id: 2, sender: "You", content: "Hey Bob! Not much, just relaxing.", timestamp: "09:47 AM" },
        { id: 3, sender: "Bob", content: "Hello! What's up?", timestamp: "09:45 AM" },
        { id: 4, sender: "You", content: "Hey Bob! Not much, just relaxing.", timestamp: "09:47 AM" },
        { id: 5, sender: "Bob", content: "Hello! What's up?", timestamp: "09:45 AM" },
        { id: 6, sender: "You", content: "Hey Bob! Not much, just relaxing.", timestamp: "09:47 AM" }
      ]
    },
    {
      id: 3,
      name: "Charlie Brown",
      avatar: img02,
      messages: [
        { id: 1, sender: "Charlie", content: "Got any plans for the weekend?", timestamp: "11:00 AM" },
        { id: 2, sender: "You", content: "Maybe, still figuring it out.", timestamp: "11:02 AM" },
        { id: 3, sender: "Charlie", content: "Got any plans for the weekend?", timestamp: "11:00 AM" },
        { id: 4, sender: "You", content: "Maybe, still figuring it out.", timestamp: "11:02 AM" },
        { id: 5, sender: "Charlie", content: "Got any plans for the weekend?", timestamp: "11:00 AM" },

      ]
    }
  ]
};

const MainChat = () => {
  const [chat, selectChat] = useState()
  const [massage, setMessage] = useState([])
  const { getChats } = useContext(ChatContext)
  const [isSearchActive, setIsSearchActive] = useState(false);

  // Toggle search visibility
  const toggleSearch = () => {
    setIsSearchActive(prev => !prev); 
  };
  const closeSreach=()=>{
    setIsSearchActive(false)
  }
  const GetChat = (id) => {
    let chats = dataset.contacts.find((contact) => id === contact.id)
    console.log("xxxxxxxxxx", chat)
    if (chats) {
      selectChat(chats)
    }
  }
  useEffect(() => {
    getChats()
  }, [])

    





  return (
    <>
      <Navbar />
    
      <div className="app02" >

        <ContactBar list={dataset} GetChat={GetChat}  toggleSearch={toggleSearch} />
     

          <div className="chat-container">
            <ChatArea chat={chat} />
            <OnFriends />
          </div>
   

        
      </div>
      {isSearchActive && <UserSearch closeSreach={closeSreach} />}
    </>
  )

}

export default MainChat;