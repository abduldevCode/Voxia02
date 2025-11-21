import express from "express";
import { AuthJWT } from "../middlewares/Auth.middleware.js";
import { CreateComment } from "../controllers/Comt.controller.js";
import { UpdateComment } from "../controllers/Comt.controller.js";
import { DeleteComment } from "../controllers/Comt.controller.js";
import { GetAllComments } from "../controllers/Comt.controller.js";

const router =express.Router()

router.post("/CreateComment/:id",AuthJWT,CreateComment)
router.post("/updateComment/:id",AuthJWT,UpdateComment)
router.delete("/DeleteComment/:id",AuthJWT,DeleteComment)
router.post("/getComments",AuthJWT,GetAllComments)
export default router;
