import { useState, useEffect, useRef } from "react";
import { Send } from "lucide-react";
import Head from "./ChatHeader";
import img02 from "../../Assets/img02.png";
import logo from "../../Assets/logo.png";
import { useContext } from "react";
import { ChatContext } from "../../Context/ChatContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';



function Input({ value, onChange, placeholder }) {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="input-2"
    />
  );
}

function ScrollArea({ children, className }) {
  return <div className={`scroll-area ${className}`}>{children}</div>;
}

function Avatar({ sender }) {
  return <img src={img02} className='avatar' style={{ width: "40px", height: "40px" }} />;
}

export default function ChatArea({ chat }) {

  const { messages, selectedChat, newMessage, SendMessage, checkUser, setNewMessage, loadChat, setLoadChat } = useContext(ChatContext)
  const messageEndRef = useRef(null);



  // This effect ensures the chat scrolls to the bottom whenever messages change
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);






  return (
    <>

      {
        selectedChat[0]?._id ?
          <div className="chain">
            <Head />
            <div className="chat-area">
              <ScrollArea className="message-container">
                {!loadChat ? (
                  <div className="loading-container">
                    <FontAwesomeIcon icon={faCircleNotch} className="loading-icon" spin />
                  </div>
                ) : (
                  messages?.map((message, index) => (
                    <div className={`message ${checkUser(message?.sender?.username) ? "sent" : ""}`} key={index}>
                      {checkUser(message?.sender?.username) ? <></> : <Avatar sender={message?.sender} />}
                      <div className={`message-bubble ${checkUser(message?.sender?.username) ? "sent-bubble" : "received-bubble"}`}>
                        <p className="message-content">{message.content}</p>
                        <p className={`message-timestamp ${checkUser(message?.sender?.username) ? "lit" : ""}`}>12 02 2024</p>
                      </div>
                    </div>
                  ))
                )}
                {/* This div will force the scroll to the bottom */}
                <div ref={messageEndRef} />
              </ScrollArea>
              <div
                className="input-area-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                />

                <button className="button" onClick={SendMessage} > <Send className="send-icon" />
                </button>
              </div>
            </div>
          </div>
          :


          <div className="download-container">
            <div className="image-section">
              <img
                src={logo} // You can use a better image or local one
                alt="WhatsApp Video Call"
                className="laptop-image"
              />
            </div>
            <h1 className="titl">Download Voxia for Windows</h1>
            <p className="description">
              Make calls, share your screen and get a faster experience when you download the Windows app.
            </p>
            <button className="download-btn">Download</button>
            <p className="footer-note">
              🔒 Your personal messages are end-to-end encrypted
            </p>
          </div>

      }


    </>
  );
}
