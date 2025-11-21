import mongoose, { Schema } from "mongoose";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const UserSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        fullname: {
            type: String,
            required: true,
            trim: true,
            index: true
        },

        avatar: {
            type: String,

        },
        coverimage: {
            type: String
        },
        password: {
            type: String,
            required: function () {
                return !this.googleId;
            },
        },
        googleId: {
            type: String,
            unique: true, 
            sparse: true, 
        },
        refreshToken: {
            type: String
        },
        dateOfBirth: {
            type: Date
        },
        job: {
            type: String,
            trim: true
        },
        location: {
            type: String,
            trim: true
        },
        relationshipStatus: {
            type: String,
            enum: ['Single', 'Married', 'In a Relationship'],
            default: 'Single'
        },
        bio: {
            type: String,
            maxlength: 300
        }

    },
    {
        timestamps: true
    }
);

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

UserSchema.methods.isPasswordCorrect = async function (password) { // Check password during login
    return await bcrypt.compare(password, this.password);
};

UserSchema.methods.generateAccessToken = function () { // Generate access token
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    );
};

UserSchema.methods.generateRefreshToken = function () { // Generate refresh token
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    );
};

export const User = mongoose.model("User", UserSchema);
