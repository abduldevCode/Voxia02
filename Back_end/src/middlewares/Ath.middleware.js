import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import jwt from 'jsonwebtoken';
import { User } from "../models/User.model.js";
import { Post } from "../models/Post.model.js";

export const Authorship = AsyncHandler(async (req, res, next) => {
    const { postid } = req.body
    if (!postid) {
        throw new ApiError(400, "client side error")
    }
    const findPost = await Post.findById(postid)
    if (!findPost) {
        throw new ApiError(404, "Post not found")
    }
    if (findPost.user.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You do not have permission to perform this action");
    }
    next();

})