import React, { useState } from 'react';
import './Conn.css'; // Link to the CSS file
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserMinus, faUserPlus, faUserTimes } from '@fortawesome/free-solid-svg-icons';
import { FaSquareArrowUpRight } from "react-icons/fa6";
import img02 from "../../Assets/img02.png"
import Navbar from '../../Components/Navbar/Navbar';
import { UserContext } from '../../Context/UserContext';
import { useContext } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const sampleFollowers = [
    {
        id: 1,
        name: 'John Doe',
        username: 'johndoe',
        bio: 'Software engineer from NYC.',
        avatar: img02,
        mutualConnections: 5,
    },
    {
        id: 2,
        name: 'Jane Smith',
        username: 'janesmith',
        bio: 'UX Designer and coffee enthusiast.',
        avatar: img02,
        mutualConnections: 8,
    },
    {
        id: 3,
        name: 'Michael Johnson',
        username: 'mjohnson',
        bio: 'Product manager at TechCo.',
        avatar: img02,
        mutualConnections: 12,
    },
    {
        id: 4,
        name: 'Emily Davis',
        username: 'emilydavis',
        bio: 'Front-end developer and coffee lover.',
        avatar: img02,
        mutualConnections: 15,
    },
    {
        id: 5,
        name: 'James Wilson',
        username: 'jamesw',
        bio: 'Data scientist with a passion for AI.',
        avatar: img02,
        mutualConnections: 7,
    },
    {
        id: 6,
        name: 'Sophia Brown',
        username: 'sophiabrown',
        bio: 'Marketing guru and social media expert.',
        avatar: img02,
        mutualConnections: 20,
    },
    {
        id: 7,
        name: 'David Lee',
        username: 'davidlee',
        bio: 'Full-stack developer working on cool projects.',
        avatar: img02,
        mutualConnections: 10,
    },
    {
        id: 8,
        name: 'Olivia Taylor',
        username: 'oliviataylor',
        bio: 'Freelance designer and photography enthusiast.',
        avatar: img02,
        mutualConnections: 13,
    },
    {
        id: 9,
        name: 'Lucas Harris',
        username: 'lucasharris',
        bio: 'Entrepreneur and startup enthusiast.',
        avatar: img02,
        mutualConnections: 9,
    }
];



const Followers = () => {

    const { listFollow, GetFollowList,setFollowList ,FollowFunc, loadUser } = useContext(UserContext)

  const navigate=useNavigate()
    useEffect(() => {
        GetFollowList()
    }, [])


    const submit = (userId) => {
        FollowFunc(userId)
    }
    const Reject = (userId) => {
        setFollowList((users) => users.filter((user) => user?._id !== userId))
    }

    return (
        <>

            <Navbar />
            <div className="containerCon">

                <p className="titleCon">Your Followers</p>
                <div className="followers-grid">
                    {listFollow.map((follower) => (
                        <div key={follower._id} className="follower-card">
                            <div className="follower-info" 
                               onClick={() => navigate(`/profile/${follower._id}`)} 
                            >
                                <img
                                    src={follower?.avatar|| img02}
                                    alt={`${follower.name}'s avatar`}
                                    className="avatar303"
                                />
                                <div className="follower-details006">
                                    <p className="follower-name006">{follower?.username}</p>

                                    <p className="follower-bio006">{follower?.job || "Gov Employee"} </p>
                                </div>
                            </div>
                            <div className="mutual-connections">
                                {follower.mutualConnections} mutual connections
                            </div>
                            <div className="actions">
                                <button className="follow-btn"
                                    onClick={() => submit(follower._id)}>
                                    <FontAwesomeIcon icon={faUserPlus} className="icon006" />
                                    {follower.isFollowed ? "Followed" : "Follow"}</button>



                                <button className="msgs-btn" onClick={()=>Reject(follower._id)} >
                                    Reject
                                    <FaSquareArrowUpRight className="icon007" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>

    );
};

export default Followers;
