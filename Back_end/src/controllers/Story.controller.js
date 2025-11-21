import { AsyncHandler } from "../utils/AsyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Story } from "../models/Story.model.js";


const AddStory = AsyncHandler(async (req, res) => {

    const { text } = req.body;
    const imageLocalPath = req.files?.image?.[0]?.path;
    const videoLocalPath = req.files?.video?.[0]?.path;
    console.log("FILES RECEIVED:", req.files);
    console.log("imageLocalPath:", imageLocalPath);
    console.log("videoLocalPath:", videoLocalPath);
    

    if (!(text || imageLocalPath || videoLocalPath)) {
        throw new ApiError("data required")
    }

    let newImage;
    let newVideo;

    if (imageLocalPath) {
        newImage = await uploadOnCloudinary(imageLocalPath);
    }
    if (videoLocalPath) {
        newVideo = await uploadOnCloudinary(videoLocalPath)
        console.log("videooooooooooooo", newVideo)
    }

    try {

        const newStory = {
            user: req.user._id,
            image: newImage?.url,
            video: newVideo?.url,
            text: text,
            timestamp: new Date(),
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
        };


        const userStory = await Story.create(newStory);
     console.log("story is " ,userStory)
        if (!userStory) {
            throw new ApiError("story not found")
        }
        const populatedStory = await userStory.populate({
            path: 'user',               // Populate the 'user' field
            select: 'avatar username'   // Only return 'avatar' and 'username' from the User model
        }); console.log("story is " ,populatedStory)
        return res.status(200).json({
            statusCode: 200,
            message: "Story added successfully",
            data: populatedStory
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json(new ApiError("Server Error"));
    }
});

const deleteStory = AsyncHandler(async (req, res) => {
    const storyId = req.params.id;

    
     
    const userStory = await Story.findOneAndDelete({ 
        _id: storyId,
        user: req.user._id 
    });

    if (!userStory) {
        throw new ApiError("Story not found or you do not have permission to delete it");
    }
  
    const updatedStories = await Story.find();
     
    return res.status(200).json({
        statusCode: 200,
        message: "Story deleted successfully",
        data: updatedStories,
    });
});


const getStories = AsyncHandler(async (req, res) => {
    const userId = req.user._id;  // Assuming the logged-in user ID is available via req.user._id

    // Aggregate query to prioritize the logged-in user's story and retrieve all story attributes, username, avatar, and story images
    const stories = await Story.aggregate([
        {
            $addFields: {
                isLoggedInUser: { $eq: ["$user", userId] }  // Add a field to check if this story belongs to the logged-in user
            }
        },
        {
            $sort: {
                isLoggedInUser: -1,  // Sort by whether the story belongs to the logged-in user (true comes first)
                createdAt: -1         // Sort the rest of the stories by creation date (newest first)
            }
        },
        {
            $lookup: {
                from: "users",       // The collection name where user data is stored
                localField: "user",   // The field in the Story collection that references the User
                foreignField: "_id",  // The field in the User collection
                as: "user"            // The alias for the populated user data
            }
        },
        {
            $unwind: { path: "$user", preserveNullAndEmptyArrays: true }  // Unwind the user array
        },
        {
            $project: {
                // Keep all fields of the story
                _id: 1,               // Include story _id
                title: 1,             // Include title
                text: 1,           // Include content
                image: 1, 
                video:1,         
                createdAt: 1,         // Include createdAt timestamp
                updatedAt: 1,         // Include updatedAt timestamp if it exists
                isLoggedInUser: 1,    // Keep isLoggedInUser field for sorting
                // Project the user fields (username, avatar, and image)
                user: {
                    _id: "$user._id",
                    username: "$user.username",  // Include username from the user object
                    avatar: "$user.avatar",      // Include avatar from the user object (image URL)

                }
            }
        }
    ]);

    return res.status(200).json({
        statusCode: 200,
        message: "All stories",
        data: stories
    });
});



export { AddStory, deleteStory, getStories }