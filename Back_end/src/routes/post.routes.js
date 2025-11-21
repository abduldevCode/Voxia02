import express from "express";
import { AuthJWT } from "../middlewares/Auth.middleware.js";
import { Authorship } from "../middlewares/Ath.middleware.js";
import { upload } from "../middlewares/Multer.js";
import { createPost } from "../controllers/Post.controller.js";
import { updatePost } from "../controllers/Post.controller.js";
import { deletePost } from "../controllers/Post.controller.js";
import { getPosts } from "../controllers/Post.controller.js";
import { getPostbyId } from "../controllers/Post.controller.js";
import { likePost } from "../controllers/Post.controller.js";
import { unlikePost } from "../controllers/Post.controller.js";
import { getUserPosts } from "../controllers/Post.controller.js";
const router =express.Router()


router.post(
    '/createPost',
    AuthJWT,
    upload.fields([
        { name: "image", maxCount: 7 },
        { name: "video", maxCount: 7 }
    ]),
    createPost
);

router.patch('/updatePost/:id',
    AuthJWT,
    upload.fields([
    { name: "image", maxCount: 7 },
    { name: "video", maxCount: 7 }
]),updatePost)

router.delete('/DeletePost/:id' , AuthJWT,deletePost)
router.get("/getPosts",AuthJWT,getPosts)
router.get('/postById/:id',getPostbyId)
router.post('/likePost',AuthJWT,likePost)
router.post('/DislikePost/:id',AuthJWT,unlikePost)
router.post('/userPosts',AuthJWT,getUserPosts)

export default router