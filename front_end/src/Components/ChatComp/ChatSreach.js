import React, { useState, useEffect, useRef } from 'react';
import img02 from "../../Assets/img02.png";
import { useContext } from 'react';
import { ChatContext } from '../../Context/ChatContext';
import { IoIosContacts } from "react-icons/io";



export default function UserSearch({ closeSreach }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isListVisible, setIsListVisible] = useState(false);
    const inputRef = useRef(null);

    const { search, setSearch, filteredUsers, setFilteredUsers, searchUser, AccessChat } = useContext(ChatContext);

    // Handle background click to close the search
    const handleBackgroundClick = (e) => {
        if (e.target.classList.contains('user-search-container')) {
            closeSreach();
            setFilteredUsers("")
        }
    };


    useEffect(() => {
        if (search) {
            searchUser();
            setIsListVisible(true);
        } else {
            setIsListVisible(false);
        }
        return () => setFilteredUsers([]);
    }, [search]);

    const submit = (id) => {
        AccessChat(id)
        closeSreach();
    }

    return (
        <div className="user-search-container" onClick={handleBackgroundClick}>

            <div className="input-container02">

                <div className='gip'>
                    <div className='upper' >
                        <p className=' fif' >
                            Contacts
                        </p>
                        <p className='fif02'>
                            <IoIosContacts />
                        </p>
                    </div>
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search for a user..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="search-input02"
                    />

                </div>


                {isListVisible && (
                    <ul className="user-list">
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map((user) => (
                                <li
                                    key={user?._id}
                                    className="user-list-item"
                                    onClick={() => submit(user._id)}
                                >
                                    <div className="user-info">
                                        <img
                                            src={user?.avatar || img02} // Fallback image in case avatar is missing
                                            alt={user?.username}
                                            className="user-avatar"
                                        />
                                        <span className="user-name">{user?.username}</span>
                                    </div>
                                    <button className="message-button">Message</button>
                                </li>
                            ))
                        ) : (
                            <li className="no-users">No users found</li>
                        )}
                    </ul>
                )}

            </div>

        </div>
    );
}
