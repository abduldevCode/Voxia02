import express from "express";
import { AuthJWT } from "../middlewares/Auth.middleware.js";
import { CreateMessage } from "../controllers/Message.contoller.js";
import { DeleteMessage } from "../controllers/Message.contoller.js";
import { GetAllMessage } from "../controllers/Message.contoller.js";
import { CreateNotification } from "../controllers/Message.contoller.js";
import { getNotifications } from "../controllers/Message.contoller.js";
import { readAllNotification } from "../controllers/Message.contoller.js";

const router =express.Router()

router.post("/CreateMessage/:id",AuthJWT,CreateMessage)
router.post( "/DeleteMessage/:id",AuthJWT,DeleteMessage )
router.post("/GetAllMessage",AuthJWT,GetAllMessage)
router.post("/CreateNotify",AuthJWT,CreateNotification)
router.get("/getNotifications",AuthJWT,getNotifications)
router.post("/readAllNotification",AuthJWT,readAllNotification)


export default router;