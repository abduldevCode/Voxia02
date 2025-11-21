import { AsyncHandler } from "../utils/AsyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { User } from "../models/User.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";
import { Post } from "../models/Post.model.js";
import { Like } from "../models/Like.model.js";


const createPost = AsyncHandler(async (req, res) => {
    const { content } = req.body;

    if (!content && !req.files?.image && !req.files?.video) {
        throw new ApiError(400, "Include content or media (image/video)");
    }

    const videoLocalPath = req.files?.video ? req.files.video.map(file => file.path) : [];
    const imageLocalPath = req.files?.image ? req.files.image.map(file => file.path) : [];

    const mediaLocalPath = [...imageLocalPath, ...videoLocalPath];
    let newMediaFile;

    if (mediaLocalPath.length > 0) {
        newMediaFile = await Promise.all(
            mediaLocalPath.map(filePath => uploadOnCloudinary(filePath))
        );
    }

    const newPost = await Post.create({
        user: req.user._id,
        content: content || null,
        media: newMediaFile ? newMediaFile.map(media => media.url) : null,
    });

    if (!newPost) {
        throw new ApiError(500, "Server error: Could not create post");
    }
    const populatedPost = await newPost.populate({
        path: 'user',
        select: '_id username avatar',
    })
    return res.status(200).json({
        statusCode: 200,
        message: "Post created successfully",
        data: populatedPost
    });
});

const updatePost = AsyncHandler(async (req, res) => {
    let { content, image, video } = req.body;

    // Check if user wants to remove everything
    const noContent = !content?.trim();
    const noNewVideos = !req.files?.video && (!video || (Array.isArray(video) && video.length === 0));
    const noNewImages = !req.files?.image && (!image || (Array.isArray(image) && image.length === 0));

    if (noContent && noNewVideos && noNewImages) {
        throw new ApiError(400, "Include at least content or media (image/video)");
    }

    let newArray = [];

    // Handle videos
    if (video || req?.files?.video) {
        const videoLocalPath = req.files?.video ? req.files.video.map(file => file.path) : [];
        let newMediaFile = [];

        if (videoLocalPath.length > 0) {
            newMediaFile = await Promise.all(
                videoLocalPath.map(filePath => uploadOnCloudinary(filePath))
            );
        }

        const safeVideoArray = typeof video === "string" ? [video] : Array.isArray(video) ? video : [];
        newArray.push(...(newMediaFile.map(media => media.url) || []), ...safeVideoArray);
    }

    // Handle images
    if (image || req?.files?.image) {
        const imageLocalPath = req.files?.image ? req.files.image.map(file => file.path) : [];
        let newMediaFile = [];

        if (imageLocalPath.length > 0) {
            newMediaFile = await Promise.all(
                imageLocalPath.map(filePath => uploadOnCloudinary(filePath))
            );
        }

        const safeImageArray = typeof image === "string" ? [image] : Array.isArray(image) ? image : [];
        newArray.push(...(newMediaFile.map(media => media.url) || []), ...safeImageArray);
    }

    // Update logic
    const updateObj = {
        content: content ?? "", // Allow empty string to overwrite
        media: newArray.length > 0 ? newArray : [], // Allow empty array to overwrite
    };

    const updatedPost = await Post.findByIdAndUpdate(
        req.params.id,
        updateObj,
        { new: true }
    ).populate('user', 'username avatar');

    if (!updatedPost) {
        throw new ApiError(500, "Server error: Could not update post");
    }

    return res.status(200).json({
        statusCode: 200,
        message: "Post updated successfully",
        data: updatedPost,
    });
});

const deletePost = AsyncHandler(async (req, res) => {

    try {
        const result = await Post.findByIdAndDelete(req.params.id)
        if (!result) {
            throw new ApiError(400, "Post not find")
        }
        return res.status(200).json({
            statusCode: 200,
            message: "Post delete Successfully"
        })
    } catch (error) {
        throw new ApiError(404, "delete item fail")
    }

})

const getUserPosts = AsyncHandler(async (req, res) => {
    try {
    const  {userId } = req.body;

        if (!userId) {
            throw new ApiError(400, "User ID is required");
        }

        const posts = await Post.find({user:userId }).populate('user', 'username avatar');

        if (!posts || posts.length === 0) {
            throw new ApiError(404, "No posts found for this user");
        }
            
        res.status(200).json({
            statusCode: 200,
            message: "Posts fetched successfully",
            data: posts
        });

    } catch (error) {
        console.error(error);
        throw new ApiError(500, "Server error");
    }
});


const getPosts = AsyncHandler(async (req, res) => {
    try {
        const userId = req.user._id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 3;
        const skip = (page - 1) * limit;
        
        const posts = await Post.aggregate([
            {
                $lookup: {
                    from: 'likes',
                    localField: '_id',
                    foreignField: 'post',
                    as: 'likes'
                }
            },
            {
                $addFields: {
                    likeCount: { $size: '$likes' }
                }
            },
            {
                $addFields: {
                    isLiked: {
                        $in: [userId, '$likes.user']
                    }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $unwind: {
                    path: '$user',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    content: 1,
                    media: 1,
                    likeCount: 1,
                    isLiked: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    user: {
                        _id: 1,
                        username: 1,
                        avatar: 1
                    }
                }
            },
            { $skip: skip },
            { $limit: limit }
        ]);
        
        // Get total count for pagination info
        const totalPosts = await Post.countDocuments();
        const hasMore = (page * limit) < totalPosts;
        
        if (!posts || posts.length === 0) {
            return res.status(200).json({
                statusCode: 200,
                message: "No more posts available",
                data: [],
                hasMore: false
            });
        }
        
        res.status(200).json({
            statusCode: 200,
            message: "Posts retrieved successfully",
            data: posts,
            page,
            hasMore
        });
        
    } catch (error) {
        console.error("Error occurred:", error);
        throw new ApiError(404, "Server error");
    }
});


const getPostbyId = AsyncHandler(async (req, res) => {
    try {
    
        const post = await Post.findById(req.params.id)
            .populate('user')

        if (!post) {
            return res.status(404).json({
                statusCode: 404,
                message: "Post not found",
            });
        }

       
        return res.status(200).json({
            statusCode: 200,
            message: "Desired post found",
            data: post,
        });
    } catch (error) {
        
        return res.status(500).json({
            statusCode: 500,
            message: "Server Error",
            error: error.message,
        });
    }
});

const likePost = AsyncHandler(async (req, res) => {
    const { postId } = req.body; 
    const userId = req.user._id;

    try {
        console.log("this is find", postId), console.log("this is find", userId)
     
        const existingLike = await Like.findOne({ post: postId, user: userId });

        if (existingLike) {
            
            await existingLike.deleteOne();

            return res.status(200).json({
                statuscode: 200,
                message: "Like removed successfully",
            });
        }

       
        const like = await Like.create({
            post: postId,
            user: userId,
        });
        if (!like) {
            throw new ApiError(500, "Server error: Could not like post");
        }
        return res.status(201).json({
            statuscode: 201,
            message: "Post liked successfully",
            data: like
        });

    } catch (error) {
        console.error(error);
        throw new ApiError(500, "Server error");
    }
});


const unlikePost = AsyncHandler(async (req, res) => {
    const { id: postId } = req.params; 
    const userId = req.user._id;

    try {
       
        const like = await Like.findOneAndDelete({
            post: postId,
            user: userId,
        });

    
        if (like) {
        
            const updatedPost = await Post.findByIdAndUpdate(
                postId,
                { $pull: { likes: like._id } },
                { new: true } 
            );

            return res.status(200).json({
                statuscode: 200,
                message: "Post unliked successfully",
                data: updatedPost,
            });
        }

   
        return res.status(400).json({
            statuscode: 400,
            message: "Could not unlike the post or post not liked yet",
        });
    } catch (error) {
        throw new ApiError(500, "Server error");
    }
});



export { createPost, updatePost, deletePost, getPosts, getPostbyId, likePost, unlikePost,getUserPosts };
