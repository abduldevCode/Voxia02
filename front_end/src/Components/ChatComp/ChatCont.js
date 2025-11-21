import React from 'react';

import { Search } from 'lucide-react';
import img02 from "../../Assets/img02.png"
import { useContext } from 'react';
import { ChatContext } from '../../Context/ChatContext';
import { BsChatLeftText } from "react-icons/bs";


function ContactBar({ list, GetChat, setOpen, toggleSearch }) {

    const { Chats, selectedChat, setSelectedChat, AccessChat, displayUser } = useContext(ChatContext)



    return (
        <div className="sidebar02">
            <div className='simple'>
                <div className="search-bar-02" onClick={toggleSearch} >
                    <div className="search-icon-02">
                        <Search className="search-icon-svg" />
                    </div>
                    <Input
                        placeholder="Search contacts"
                        className="search-input-sec-2"
                        inputProps={{ 'aria-label': 'search contacts' }}
                    />
                </div>
                <ScrollArea className="contact-list">
                    {Chats && Chats.length ? (

                        Chats.map((contact) => {
                            return (
                                <div key={contact._id} className="contact-item" onClick={() => AccessChat(contact.participants[0]._id)}>
                                    <div className='extras'>
                                        <img src={img02} className='avatar0011' />
                                        <div className="contact-infos">
                                            <p className="contact-name02">{displayUser(contact?.participants)}</p>
                                            <p className='latest-line'>hi , how are you</p>
                                        </div>
                                    </div>
                                    {contact.id === 1 || contact.id === 3 ? <p className='nums'>3</p> : <></>}
                                </div>
                            )
                        })

                    ) : (
                      <div className='noChat'> < p > <BsChatLeftText /> No Chats</p></div>

                    )}


                </ScrollArea>
            </div>
        </div >
    );
}

export default ContactBar;




function ScrollArea({ children, className }) {
    return <div className={`scroll-area ${className}`}>{children}</div>;
}



function Input({ placeholder, className, value, onChange }) {
    return (
        <input
            type="text"
            placeholder={placeholder}
            className={`input ${className}`}
            value={value}
            onChange={onChange}
        />
    );
}