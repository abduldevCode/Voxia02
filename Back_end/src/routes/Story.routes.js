import express from "express";
import { AuthJWT } from "../middlewares/Auth.middleware.js";
import { upload } from "../middlewares/Multer.js";
import { AddStory, deleteStory, getStories } from "../controllers/Story.controller.js";

const router = express.Router();

router.post("/addStory",
  AuthJWT,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1}
  ]), 
  AddStory
);
router.delete("/deleteStory/:id", AuthJWT, deleteStory)
router.get("/getStories", AuthJWT, getStories)
export default router;
