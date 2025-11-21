/*port express from "express";
import passport from 'passport';
import { loginSuccess } from '../controllers/User.controller';

const router = express.Router()

// Initial Google OAuth login
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Google OAuth callback
router.get("/google/callback", passport.authenticate("google", {
    successRedirect: "http://localhost:3000/dashboard",
    failureRedirect: "http://localhost:3000/login"
}));

// Login success route
router.get("/login/success", loginSuccess);



export default router;
*/