import express from 'express';
import { protectRoute } from "../middleware/auth.middleware.js";
import { getOrCreateChatroom,getChatroomInfo } from '../controllers/chatroom.controller.js';


const router = express.Router();

router.post("/",protectRoute,getOrCreateChatroom)
router.get("/:id", protectRoute, getChatroomInfo);

export default router;