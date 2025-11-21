 /*import express from 'express';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';



const router = express.Router();

// =================== Passport Configuration ===================

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then(user => {
        done(null, user);
    });
});

// Set up Google strategy
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:8000/auth/google/callback", // Ensure this matches your callback route
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let existingUser = await User.findOne({ googleId: profile.id });
                if (existingUser) {
                    done(null, existingUser);
                } else {
                    const newUser = new User({
                        googleId: profile.id,
                        username: profile.displayName,
                        email: profile.emails[0].value,
                    });

                    await newUser.save();
                    done(null, newUser);
                }
            } catch (error) {
                done(error, null);
            }
        }
    )
);

// =================== Google Authentication Routes ===================

// Google authentication route
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email'],
}));

// Google callback route
router.get('/google/callback', passport.authenticate('google', {
    failureRedirect: '/login', // Redirect to a login page if authentication fails
}), (req, res) => {
    // Successful authentication, redirect to your desired route
    res.redirect('/'); // Adjust this to the desired route in your frontend
});

export default router;*/