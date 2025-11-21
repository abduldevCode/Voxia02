import express from 'express';
import passport from 'passport'; // Change to ES module import
import jwt from 'jsonwebtoken'; // Import jwt since you're using it in the callback
import { FetchProfile, registerUser } from '../controllers/User.controller.js';
import { loginUser  } from '../controllers/User.controller.js';
import { upload } from '../middlewares/Multer.js';
import { AuthJWT } from '../middlewares/Auth.middleware.js';
import { logout } from '../controllers/User.controller.js';
import { changePassword } from '../controllers/User.controller.js';
import { updateProfile } from '../controllers/User.controller.js';
import { updateProfileImage } from '../controllers/User.controller.js';
import { followUser, getUserList, getUserProfile } from '../controllers/UserFunc.controller.js';
import { SearchQuery } from '../controllers/UserFunc.controller.js';
import { updateSoftware } from '../controllers/User.controller.js';

const router = express.Router();

// Ensure the route matches the request method (POST in this case)
router.route('/register').post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverimage",
            maxCount: 1
        }
    ]),
    registerUser
);

router.post('/login', loginUser);
router.route('/logout').post(AuthJWT, logout);
router.post('/changePass', changePassword);
router.post('/FetchProfile', FetchProfile);



router.post(
    '/updateProfile',
    AuthJWT,
    upload.fields([
        { name: 'avatar', maxCount: 1 },
        { name: 'coverimage', maxCount: 1 }
    ]),
    updateProfile
);

router.post(
    '/updateProfileImage',
    AuthJWT,
    upload.fields([
        { name: "avatar", maxCount: 1 },
        { name: "coverimage", maxCount: 1 }
    ]),
    updateProfileImage
);

  



router.get("/getuser", AuthJWT, getUserList);
router.get("/getUserProfile", AuthJWT, getUserProfile);
router.post("/followUser", AuthJWT, followUser);
router.get("/query", AuthJWT, SearchQuery);
router.get("/software", AuthJWT, updateSoftware);

export default router;
