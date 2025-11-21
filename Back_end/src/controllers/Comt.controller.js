import { AsyncHandler } from "../utils/AsyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { Post } from "../models/Post.model.js";
import { Comment } from "../models/Comment.model.js";

const CreateComment = AsyncHandler(async (req, res) => {
  try {
    const postid = req.params.id;
    const { content } = req.body;

    if (!content || content.trim() === '') {
      return res.status(400).json({ message: 'Reply content cannot be empty.' });
    }

    const FoundPost = await Post.findById(postid);
    if (!FoundPost) {
      throw new ApiError(404, "Post not found");
    }

    let newComment = await Comment.create({
      post: postid,
      user: req.user._id,
      content: content,
    });
    newComment = await newComment.populate("user", "username avatar");


    res.status(200).json({
      statuscode: 200,
      message: "Comment submitted successfully",
      data: newComment,
    });

  } catch (error) {

    throw new ApiError(500, "Server error");
  }
});


const UpdateComment = AsyncHandler(async (req, res) => {
  const CommentId = req.params.id;
  const { content } = req.body;

  if (!content || content.trim() === '') {
    return res.status(400).json({ message: 'Reply content cannot be empty.' });
  }

  const FoundComment = await Comment.findById(CommentId);
  if (!FoundComment) {
    return next(new ApiError(404, "Comment not found"));
  }

  FoundComment.content = content;
  await FoundComment.save({ validateBeforeSave: false })

  res.status(200).json({
    statuscode: 200,
    message: "Comment update successfully",
    data: FoundComment,
  });
})


const DeleteComment = AsyncHandler(async (req, res) => {
  try {  console.log('d')
    const Commentid = req.params.id;
  console.log('ccccccccccccccccccccccccc',Commentid)
    const comment = await Comment.findById(Commentid);
    if (!comment) {
      throw new ApiError(400, "Comment not found");
    }

    await Comment.findByIdAndDelete(Commentid);

    res.status(200).json({
      statuscode: "200",
      message: "Comment is deleted",
    });

  } catch (error) {
    throw new ApiError(500, "Server Error")
  }
});

const GetAllComments = AsyncHandler(async (req, res) => {
  try {
    const { postId } = req.body;

    const comments = await Comment.find({ post: postId }).populate("user", "username avatar");

    if (!comments || comments.length === 0) {
      return res.status(200).json({
        statuscode: "200",
        message: "No comments found for this post",
        data:[]
      });
    }

    res.status(200).json({
      statuscode: "200",
      message: "Comments retrieved successfully",
      data: comments,
    });
  } catch (error) {
    throw new ApiError(500, "Server Error");
  }
});



export { CreateComment, UpdateComment, DeleteComment, GetAllComments }