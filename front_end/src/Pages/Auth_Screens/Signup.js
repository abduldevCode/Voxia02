import React, { useContext, useState } from 'react'
import img1 from "../../Assets/Cap.png"
import img2 from "../../Assets/fs.png"
import img3 from "../../Assets/go.png"
import { Link } from 'react-router-dom'
import { AuthContext } from '../../Context/AthContext'
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toast } from "react-hot-toast";
export default function Signup() {
    
 const {handleSignup,setEmail,setUsername,setPassword,setFullname,fullname,email,password,username,loading,loginWithGoogle } = useContext(AuthContext);
 const submit = () => {
    toast('Develop Soon!',
        {
         icon:'⚠️',
            style: {
                borderRadius: '10px',
                background: '#fff',
                color: '#000',
            },
        }
    );
}

    return (
        <div>
            <div className="auth_bg">
                <div className="split_form">
                    <div className="form_left">

                        <div className="dd">
                            <h1 className="top_left">VOXIA</h1>
                            <h3 className="top_right" >connect to future</h3>
                        </div>

                        <div className="dx">

                            <div className="profile-container">
                                <img src={img1} alt="Profile" className="profile-imagee" />
                                <h3 className="bottom_left">@Alex_007</h3>
                            </div>

                            <h3 className="bottom_right" style={{fontSize: "14px" ,marginBottom:"15px"}}>Check out what Voxia recommend</h3>
                        </div>

                    </div>


                    <div class="form_right">
                    <h2>SignUp into <span style={{ color: "#007bff" }} >
                        VOXIA
                    </span>

                    </h2>
                        <p class="subtext">Choose option to Signup </p>
                        <form>
                            <input placeholder='UserName' type='text' value={username} class="input-field"  onChange={(e) => { setUsername(e.target.value) }} />
                            <input placeholder='FullName' type='text' value={fullname} class="input-field" onChange={(e) => { setFullname(e.target.value) }} />
                            <input placeholder='Email' type='Email' value={email} class="input-field"  onChange={(e) => { setEmail(e.target.value) }} />
                            <input placeholder='Password' type='password' value={password} class="input-field"  onChange={(e) => { setPassword(e.target.value) }} />


                            <button type="submit" class="login-button" onClick={handleSignup}>SignUp {loading?<FontAwesomeIcon icon={faSpinner} spin />:<></>}</button>

                            <div class="auth-container">
                                <p class="forgot-password">Forgot Password?</p>
                                <Link to="/login" class="signup-btn">Login</Link>
                            </div>

                            <div class="or-divider">
                                <div class="line"></div>
                                <span>OR</span>
                                <div class="line"></div>
                            </div>

                            <button type="button" class="social-button google" onClick={loginWithGoogle}>
                                <img src={img3} alt="Google" class="social-icon"    />
                                Continue with Google
                            </button>
                           
                        </form>
                    </div>

                </div>
            </div>
        </div>
    )
}
