import { AsyncHandler } from "../utils/AsyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { User } from "../models/User.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";



const registerUser = AsyncHandler(async (req, res) => {

    const { username, fullname, email, password } = req.body;
    if ([username, fullname, email, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields should filled")
    }


    const userExist = await User.findOne(
        {
            $or: [{ username }, { email }]
        }
    )

    if (userExist) {
        throw new ApiError(409, "User with Same Email and password Exist")
    }

    
    const user = await User.create({
        fullname,
        username: username,
        email,
        password

    })

    const userCreated = await User.findById(user._id).select(
        "-password  -refreshToken"
    )
    if (!userCreated) {
        throw new ApiError(500, "SomeThing Wrong in Server ")
    }

    return res.status(200).json(
        new ApiResponse(200, userCreated, "User registered Successfully")
    )



});


const loginUser = AsyncHandler(async (req, res) => {
    const { email, password } = req.body;


    if (!email) {
        throw new ApiError(400, "Email and Password are required");
    }

    const userFound = await User.findOne({ email });

    if (!userFound) {
        throw new ApiError(404, "User not found");
    }

    const isPasswordCorrect = await userFound.isPasswordCorrect(password);

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid password");
    }

    const accessToken = await userFound.generateAccessToken(userFound._id);

    const userCreated = await User.findById(userFound._id).select(
        "-password  -refreshToken"
    )
    if (!userCreated) {
        throw new ApiError(500, "SomeThing Wrong in Server ")
    }
    /* 
        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production'
        }; */


    return res.status(200)
        /*  .cookie("AccessToken", accessToken, options)*/
        .json(new ApiResponse(200, { accessToken, userCreated }, "User logged in successfully"));
});


const logout = AsyncHandler(async (req, res) => {
    const { username } = req.user;
    const options = {
        httpOnly: true,
        secure: true
    }
    return res.status(200)
        .clearCookie('AccessToken', options)
        .json(new ApiResponse(200, "User logout successfully", `${username} is logout `))
})


const FetchProfile = AsyncHandler(async (req, res) => {
    const { id } = req.body;
    const user = await User.findById(id).select(
        "-password  -refreshToken"
    )
    if (!user) {
        throw new ApiError(500, "SomeThing Wrong in Server ")
    }
    return res.status(200)
        .json(new ApiResponse(200, user, "Fetch Profile"));
})


const changePassword = AsyncHandler(async (req, res) => {
    const { email, password, newpassword } = req.body;
    if (!(email || password || newpassword)) {
        throw new ApiError(400, "Cradentials required !!!")
    }
    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(400, "invaid cradentials")
    }
    console.log("username ", user.fullname)
    const isPasswordCorrect = await user.isPasswordCorrect(password);

    if (!isPasswordCorrect) {
        throw new ApiError(400, "invaid old password")
    }
    user.password = newpassword;
    user.save({ validateBeforeSave: false })

    return res.status(200).json(new ApiResponse(200, "Change Password Sucessfully"))
})


const updateProfile = AsyncHandler(async (req, res) => {
    const { username, fullname, dateOfBirth,job,location,bio, relationshipStatus } = req.body; // Destructure username from request body

    console.log("username", req.body);


    const user = await User.findById(req.user._id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverimageLocalPath = req.files?.coverimage?.[0]?.path;

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverimage = await uploadOnCloudinary(coverimageLocalPath);


    try {

        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            {
                username: username,
                fullname: fullname,
                dateOfBirth
                ,job
                ,location
                ,bio
                , relationshipStatus,
                avatar: avatar?.url || user?.avatar || null,
                coverimage: coverimage?.url || user?.coverimage || null
            },
            { new: true }
        ).select("-password");


        if (!updatedUser) {
            return res.status(404).json(new ApiResponse(404, "User not found"));
        }

        // Respond with the updated user data
        res.status(200).json(new ApiResponse(200, updatedUser, "Profile updated successfully"));
    } catch (error) {
        // Log the error for debugging purposes
        console.error("Error updating user profile:", error);
        throw new ApiError(500, "Server Error");
    }



});


const updateProfileImage = AsyncHandler(async (req, res) => {

    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverimageLocalPath = req.files?.coverimage?.[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(410, "Avater File is required..")
    }
    if (!coverimageLocalPath) {
        throw new ApiError(410, "coverimage File is required..")
    }

    const newAvatar = await uploadOnCloudinary(avatarLocalPath);
    const newCoverimage = await uploadOnCloudinary(coverimageLocalPath);

    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.user?.id,
            {
                avatar: newAvatar.url,
                coverimage: newCoverimage.url
            },
            { new: true }
        ).select("-password")

        res.status(200).json(new ApiResponse(200, updatedUser, "ProfileImage updated successfully"))

    } catch (error) {
        throw new ApiError(500, "problem in image upload")
    }


})


const updateSoftware = AsyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { username, email, fullname } = req.body;

    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }


        user.username = username;


 
        user.email = email;
  

    // Update fullname if provided
    if (fullname) {
        user.fullname = fullname;
    }

    await user.save();

    res.status(200).json({
        message: 'Profile updated successfully',
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            fullname: user.fullname,
        },
    });
});




export {
    registerUser, loginUser, logout, changePassword,
    updateProfile, updateProfileImage, FetchProfile,updateSoftware
};
