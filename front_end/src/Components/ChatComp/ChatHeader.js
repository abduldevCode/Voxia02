import React from 'react';
import { Bell, Settings } from 'lucide-react';
import img02 from "../../Assets/img02.png"
import { useContext } from 'react';
import { ChatContext } from '../../Context/ChatContext';
const Head = () => {
    const {selectedChat,displayUser}=useContext(ChatContext)
    return (
        <header className="header01" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>

            <div  className="friend-item03" style={{marginLeft:"8px"}}>
                <div className="avatar-second">
                    <div className="avatar-sec">
                        <img src={img02} alt="Avatar" />
                    </div>
                  
                </div>

                <div className="friend-info">
                    <p className="friend-named">{displayUser(selectedChat[0]?.participants)|| "unknow"}</p>
                    <div className="status">

                        <p className="status-text">Online</p>
                    </div>
                </div>
            </div>
            <div className="header-actions" style={{ display: 'flex', alignItems: 'center' }}>

                <button
                    type="button"
                    style={{
                        background: 'none',
                        border: 'none',
                        padding: '8px',
                        cursor: 'pointer',
                        marginRight: '10px',
                        color: '#007bff',
                    }}
                >
                    <Settings className="icon" style={{ width: '20px', height: '20px' }} />
                </button>


            </div>
        </header>
    );
};

export default Head;
