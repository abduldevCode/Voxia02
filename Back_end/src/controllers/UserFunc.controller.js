import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import { User } from "../models/User.model.js";
import { SocialFollow } from "../models/Follow.model.js";
import { Post } from "../models/Post.model.js";



const getUserList = async (req, res) => {
  try {

    if (!req.user || !req.user._id) {
      return res.status(400).json({ message: 'User ID is missing from the request' });
    }

    const users = await User.aggregate([
      {
        $lookup: {
          from: 'socialfollows',
          localField: '_id',
          foreignField: 'followee',
          as: 'followData'
        }
      },
      {
        $addFields: {
          isFollowed: {
            $in: [req.user._id, '$followData.follower']
          }
        }
      },
      {
        $match: {
          isFollowed: false,
          _id: { $ne: req.user._id }
        }
      },
      {
        $project: {
          username: 1,
          _id: 1,
          avatar: 1,
          isFollowed: 1
        }
      }
    ]);

    if (!users) {
      return res.status(404).json({ message: 'No users found' });
    }

    return res.status(200).json({ statusCode: 200, data: users });
  } catch (error) {
    console.error('Error in getUserList:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};


const getUserProfile = AsyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password -refreshToken");
  if (!user) {
    throw new ApiError("User not found");
  }


  const followerCount = await SocialFollow.countDocuments({ followee: req.user._id });

  const followingCount = await SocialFollow.countDocuments({ follower: req.user._id });

  const postsCount = await Post.countDocuments({ user: req.user._id });

  const response = {
    username: user?.username,
    fullname: user?.fullname,
    _id: user?._id,
    avatar: user?.avatar,
    coverimage: user?.coverimage,
    posts: postsCount || 0,
    followerCount,  // Follower count fetched from SocialFollow
    followingCount  // Following count fetched from SocialFollow
  };

  return res.status(200).json({
    statusCode: 200,
    message: "Get user profile successfully",
    data: response
  });
});


const followUser = AsyncHandler(async (req, res) => {
  const { userId } = req.body;
  try {

    const existingFollow = await SocialFollow.findOne({
      $and: [{ follower: req.user._id }, { followee: userId }]
    });

    const user = await User.findById(userId)
    if (!user) {
      throw new ApiError(400, "user not find")
    }

    if (existingFollow) {
      await SocialFollow.deleteOne({ _id: existingFollow._id });
      return res.status(200).json({ statusCode: 200, message: 'User unfollowed successfully', data: { username: user.username, status: false } });
    } else {
      const follow = await SocialFollow.create({
        follower: req.user._id,
        followee: userId
      });

      if (!follow) {
        throw new ApiError(499, "Error creating follow");
      }
      return res.status(200).json({ statusCode: 200, message: 'User followed successfully', data: { username: user.username, status: true } });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
});


const SearchQuery = AsyncHandler(async (req, res) => {
  const searchQuery = req.query.search || '';
  let userQuery = {};
  let postQuery = {};

  if (searchQuery) {
    userQuery = {
      $or: [
        { name: { $regex: searchQuery, $options: "i" } },
        { email: { $regex: searchQuery, $options: "i" } },
      ],
    };
  }

  if (searchQuery) {
    const postSearchTerm = searchQuery.trim().split(' ').pop();
    postQuery = {
      content: { $regex: postSearchTerm, $options: "i" },
    };
  }

  try {

    const users = await User.find(userQuery).find({ _id: { $ne: req.user._id } }).limit(3);

    const posts = await Post.find(postQuery).limit(3)

    res.json({
      users,
      posts,
    });
  } catch (error) {
    throw new ApiError(500, "Server Error");
  }
});




export { getUserList, getUserProfile, followUser, SearchQuery };
