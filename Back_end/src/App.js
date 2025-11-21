import express from "express";
import cors from "cors";
import cookieParser from 'cookie-parser';
import passport from 'passport'; 
import { User } from "./models/User.model.js";
import OAuth2Strategy from 'passport-google-oauth2';
import jwt from 'jsonwebtoken';


const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE,PATCH",
    credentials: true
}));

// Initialize Passport
app.use(passport.initialize());


passport.use(new OAuth2Strategy(
  {
    clientID: "92090739833-v0okf3fcf1a121imt24ff2t52588rbul.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "/auth/google/callback",
    scope: ["profile", "email"],
    session: false  // Disable session support
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ googleId: profile.id });

      if (!user) {
        // If user doesn't exist, create a new user in your DB
        user = await User.create({
          googleId: profile.id,
          username: profile.displayName,
          fullname: profile.displayName,
          email: profile.emails[0].value,
        });
      }

      // Generate JWT token
      const token = await user.generateAccessToken(user._id);

      // Return the user object and token together
      return done(null, { user, token });
    } catch (error) {
      return done(error, null);
    }
  }
));



// Google OAuth Routes
// Step 1: Initiates Google OAuth flow
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));

// Step 2: Callback route after Google OAuth authentication
app.get('/auth/google/callback', passport.authenticate('google', {
  failureRedirect: 'http://localhost:3000/login',
  session: false
}), (req, res) => {
  const { user, token } = req.user;
  console.log(user);

  // Set JWT token as a cookie
  res.cookie('authToken', token, {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 3600000,  // 1 hour
    sameSite: 'Strict',  // Set sameSite to 'Strict' for added security
    path: '/'  // This ensures the cookie is accessible on the entire domain
  });
  

  // Redirect to dashboard
  res.redirect('http://localhost:3000/main');
});




// Routers
import userRouter from "./routes/user.routes.js";
import postRouter from "./routes/post.routes.js";
import commentRouter from "./routes/Comt.routes.js";
import storyRouter from "./routes/Story.routes.js";
import chatRouter from "./routes/Chat.routes.js";
import messageRouter from "./routes/Message.routes.js";

app.use("/api/v1/users", userRouter);
app.use("/api/v1/users", postRouter);
app.use("/api/v1/users", commentRouter);
app.use("/api/v1/users", storyRouter);
app.use("/api/v1/users", chatRouter);
app.use("/api/v1/users", messageRouter);

export { app };



