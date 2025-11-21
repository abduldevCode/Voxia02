import express from "express";
import { AuthJWT } from "../middlewares/Auth.middleware.js";
import { AccessChat, DeleteChat, GetAllChat, allUsers } from "../controllers/Chat.controller.js";
const router = express.Router()

router.post("/AccessChat", AuthJWT, AccessChat)
router.post("/DeleteChat", AuthJWT, DeleteChat)
router.get("/GetAllChat", AuthJWT, GetAllChat)
router.get("/", AuthJWT, allUsers)
export default router;
