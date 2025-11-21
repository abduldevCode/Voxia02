import React, { useEffect } from 'react';
import './Profile.css'; // Import your CSS file
import bg from "../../Assets/bg.png"
import pf from "../../Assets/pf.png"
import EditProfileForm from '../../Components/EditForm';
import Navbar from '../../Components/Navbar/Navbar';
import { useState } from 'react';
import { useContext } from 'react';
import { UserContext } from '../../Context/UserContext';
import { PostContext } from '../../Context/PostContext';
import { useParams } from 'react-router-dom';
import { IoMdSend } from "react-icons/io";
import ss from "../../Assets/ss2.jpg"
import CreatePost from '../../Components/CreatePost/CreatePost';
import UserPosts from '../../Components/Post-Comp/User-Posts';

import img01 from '../../Assets/img01.png'
import img02 from '../../Assets/img02.png'
import img03 from '../../Assets/img3.png'
import img04 from '../../Assets/img04.png'
import defaul from "../../Assets/defaul.png";
import def2 from "../../Assets/deff.png";


import { MdWorkOutline } from "react-icons/md";
import { SlLocationPin } from "react-icons/sl";
import { CiCalendar } from "react-icons/ci";
import { AiOutlineMail } from "react-icons/ai";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import { SuggestToFollow } from '../Main_screen/Main';



function PhotoAlbum() {
  const photos = [
    { src: img01, alt: "Person leaning out of car window at sunset" },
    { src: pf, alt: "Desert landscape with sand dunes" },
    { src: img03, alt: "Close-up of hands holding each other" },
    { src: img04, alt: "Forest scene with white fabric or smoke trail" },
    { src: img02, alt: "Cat sitting on a light-colored surface" },
  ];

  return (
    <div className="photo-album">
      <div className="album-header">
        <h1>Photos</h1>
        <a href="/photos" className="see-all-link">See all photos</a>
      </div>
      <div className="grid grid-cols-2">
        {photos.slice(0, 2).map((photo, index) => (
          <div key={index} className="photo-container">
            <img src={photo.src} alt={photo.alt} className="photo-img" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3">
        {photos.slice(2).map((photo, index) => (
          <div key={index + 2} className="photo-container">
            <img src={photo.src} alt={photo.alt} className="photo-img" />
          </div>
        ))}
      </div>

    </div>
  );
}




export default function Profile() {
  const [activeTab, setActiveTab] = useState("Posts"); // State to track the active tab
  const tabs = ["Posts", "About", "Connections", "Events"];
  const { userId } = useParams()

  const { handleEditProfileClick, isEditProfileOpen, getUser, userDetail } = useContext(UserContext);

  useEffect(() => {
    getUser(userId) 
  }, [])

  const currProfiler = JSON.parse(localStorage.getItem('CurrProfiler'));

  return (
    <>
      <Navbar />

      <div className={`main-content ${isEditProfileOpen ? 'dimmed' : ''}`}>
        <main className="feedss" >
          <div className="card"  >
            <div className="banners">
              <img
                src={userDetail?.coverimage || def2}
                alt="Profile banner"
                width={640}
                height={200}
                className="banner-images"
              />
              <img
                src={userDetail?.avatar || defaul}
                alt="Profile picture"
                width={100}
                height={100}
                className="profile-images"
              />
            </div>
            <div className="profile-infos">
              <div className="headers">
                <div style={{ marginLeft: "15px", marginTop: "5px" }}>
                  <p className="name09">{userDetail?.fullname}</p>
                  <p className="connections">234 connections</p>
                </div>
                <div className="buttons">
                  {userDetail?._id == currProfiler?._id
                    ?

                    <>
                      <button className="edit-button" onClick={handleEditProfileClick}>Edit profile</button>
                      <p className="more-button"><PiDotsThreeOutlineVerticalFill /></p>
                    </>
                    :
                    <></>

                  }


                </div>
              </div>
              <div className="details">
                <div><MdWorkOutline className='icon' /> {userDetail?.job||"Lead Developer "}</div>
                <div><SlLocationPin className='icon' />{userDetail?.location||"Johar,Lahore"}</div>
                <div><CiCalendar className='icon' /> Joined on Nov 26, 2019</div>
              </div>
            </div>
            <nav className="nav02">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  className={`nav-button02 ${activeTab === tab ? "active" : ""}`}
                  onClick={() => setActiveTab(tab)} // Set the active tab on click
                >
                  {tab}
                  {tab === "Connections" && <span className="connections-count">230</span>}
                </button>
              ))}
            </nav>
          </div>
          <div className="tab-content">
            {activeTab === "Posts" && <>



              <CreatePost />
              <UserPosts id={userId} />


            </>}
            {activeTab === "About" && <div>About Content</div>}
            {activeTab === "Connections" && <div>Connections Content</div>}
            {activeTab === "Media" && <div>Media Content</div>}
            {activeTab === "Videos" && <div>Videos Content</div>}
            {activeTab === "Events" && <div>Events Content</div>}
            {activeTab === "Activity" && <div>Activity Content</div>}
          </div>
        </main>

        <aside className="right-sidebar" style={{ width: "450px" }}>
          <div className="cardin">
            <div className="cardin-header">
              <p className="cardin-title">About</p>
            </div>
            <div className="cardin-content">
              <div className="bio">
                <p className="sectionin-title">Bio</p>
                <p className="bio-text">
                { userDetail?.bio|| "Add your Bio here"}
                
                </p>
              </div>

              <hr className="separator" />

              <div className="personal-info">
                <p className="sectionin-title">Personal Info</p>
                <div className="info-item">
                  <span className="labelin">Born:</span>
                  <span className="info">October 19, 2020</span>
                </div>

                <div className="info-item">
                  <span className="labelin">Status:</span>
                  <span className="info status09">{ userDetail?.relationshipStatus|| "Single"}</span>
                </div>

                <div className="info-item">
                  <span className="labelin">Email:</span>
                  <a href="mailto:Rehman@gmail.com" className="email">
                   { userDetail?.email|| "Rehman@gmail.com"}
                  </a>
                </div>

                <div className="info-item">
                  <span className="labelin">Location:</span>
                  <span className="info">{userDetail?.location||"Johar,Lahore"}</span>
                </div>
              </div>
            </div>
          </div>
          <br />

          <PhotoAlbum />
          <SuggestToFollow />

        </aside>







        {/* Edit Profile Form Overlay */}
        {isEditProfileOpen && (
          <EditProfileForm />
        )}

      </div>
    </>
  );
}

