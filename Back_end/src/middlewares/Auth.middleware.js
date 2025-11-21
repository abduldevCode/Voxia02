import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import jwt from 'jsonwebtoken';
import { User } from "../models/User.model.js";

export const AuthJWT = AsyncHandler(async (req, res, next) => {
    if (!req.headers) {
        throw new ApiError(400, "Request headers are not defined");
    }
    const token = req.cookies?.accessToken || req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
        throw new ApiError(400, "Unauthorized Request!");
    }

    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (err) {
        throw new ApiError(401, "Invalid Token");
    } 
    const user = await User.findById(decodedToken._id).select("-password");

    if (!user) {
        throw new ApiError(404, "User not found");
    }
    req.user = user;

    next();
});
