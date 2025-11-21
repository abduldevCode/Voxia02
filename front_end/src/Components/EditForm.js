import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../Context/UserContext';
import { FaX } from "react-icons/fa6";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { toast } from "react-hot-toast";
import axios from 'axios';

function EditProfileForm() {
    const { handleCloseForm, userDetail, setUserDetail } = useContext(UserContext);

    const [profileImage, setProfileImage] = useState('');
    const [backgroundImage, setBackgroundImage] = useState('');
    const [profileImageDisplay, setDisplayProfileImage] = useState('');
    const [backgroundImageDisplay, setDisplayBackgroundImage] = useState('');
    const [upload, setUpload] = useState(true);

    const [username, setUserName] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [job, setJob] = useState('');
    const [location, setLocation] = useState('');
    const [relationshipStatus, setRelationshipStatus] = useState('Single');
    const [bio, setBio] = useState('');

    useEffect(() => {
        if (userDetail) {
            setUserName(userDetail.username || '');
            setDisplayProfileImage(userDetail.avatar || '');
            setDisplayBackgroundImage(userDetail.coverimage || '');
            setDateOfBirth(userDetail.dateOfBirth || '');
            setJob(userDetail.job || '');
            setLocation(userDetail.location || '');
            setRelationshipStatus(userDetail.relationshipStatus || 'Single');
            setBio(userDetail.bio || '');
        }
    }, [userDetail]);

    const handleFileChange = (e, setImage, sendImage) => {
        const file = e.target.files[0];
        sendImage(file);
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setImage(imageUrl);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpload(false);

        const formData = new FormData();
        formData.append('username', username);
        formData.append('dateOfBirth', dateOfBirth);
        formData.append('job', job);
        formData.append('location', location);
        formData.append('relationshipStatus', relationshipStatus);
        formData.append('bio', bio);

        if (profileImage) {
            formData.append('avatar', profileImage);
        }
        if (backgroundImage) {
            formData.append('coverimage', backgroundImage);
        }

        const token = localStorage.getItem('authToken');
        if (!token) {
            console.error("No authorization token found");
            return;
        }

        try {
            const response = await fetch("http://localhost:8000/api/v1/users/updateProfile", {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            if (response.ok) {
                
                const data = await response.json();
                console.log("updated",data)
                setUserDetail(data.data);
                setUpload(true);
                handleCloseForm();
                toast.success('Profile updated successfully', {
                    duration: 4000,
                    position: "top-right",
                    style: { marginTop: "50px" },
                });
            } else {
                console.error("Failed to update profile");
                setUpload(true);
            }
        } catch (error) {
            setUpload(true);
            console.error('Error:', error.message);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="edit-profile-modal">
                <button className="close-button" onClick={handleCloseForm}><FaX /></button>
                <h2>Edit Profile</h2>
                <form className="edit-form" onSubmit={handleSubmit}>
                    <div className="form-content">
                        <div className="image-section">
                            <div className="input-group">
                                <label htmlFor="profileImage" className='bio-label'>Profile Image</label>
                                <input
                                    id="profileImage"
                                    name="profileImage"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleFileChange(e, setDisplayProfileImage, setProfileImage)}
                                />
                                {profileImageDisplay && (
                                    <img src={profileImageDisplay} alt="Profile" className="profile-preview" />
                                )}
                            </div>
                            <div className="input-group">
                                <label htmlFor="backgroundImage" className='bio-label'>Background Image</label>
                                <input
                                    id="backgroundImage"
                                    name="backgroundImage"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleFileChange(e, setDisplayBackgroundImage, setBackgroundImage)}
                                />
                                {backgroundImageDisplay && (
                                    <img src={backgroundImageDisplay} alt="Background" className="background-preview" />
                                )}
                            </div>
                        </div>
                        <div className="details-section">
                            <div className="input-group">
                                <label htmlFor="name" className='bio-label'>Name</label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUserName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label htmlFor="dateOfBirth" className='bio-label'>Date of Birth</label>
                                <input
                                    type="date"
                                    id="dateOfBirth"
                                    name="dateOfBirth"
                                    value={dateOfBirth}
                                    onChange={(e) => setDateOfBirth(e.target.value)}
                                />
                            </div>
                            <div className="input-group">
                                <label htmlFor="job" className='bio-label'>Job</label>
                                <input
                                    id="job"
                                    name="job"
                                    type="text"
                                    value={job}
                                    onChange={(e) => setJob(e.target.value)}
                                />
                            </div>
                            <div className="input-group">
                                <label htmlFor="location" className='bio-label'>Location</label>
                                <input
                                    id="location"
                                    name="location"
                                    type="text"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                />
                            </div>
                            <div className="input-group">
                                <label htmlFor="relationshipStatus" className='bio-label'>Relationship Status</label>
                                <select
                                    id="relationshipStatus"
                                    name="relationshipStatus"
                                    value={relationshipStatus}
                                    onChange={(e) => setRelationshipStatus(e.target.value)}
                                >
                                    <option value="Single">Single</option>
                                    <option value="Married">Married</option>
                                    <option value="In a Relationship">In a Relationship</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="input-group">
                        <label htmlFor="bio" className='bio-label'>Bio</label>
                        <textarea
                            id="bio"
                            name="bio"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            required
                            style={{
                                padding: "5px",
                                height: "100px",
                                width: "100%",
                                border: "1px solid #ccc",
                                borderRadius: "3px",
                            }}
                        />
                    </div>
                    <button type="submit" className="update-button">
                        {upload ? 'Update Profile' : 'Updating...'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default EditProfileForm;
