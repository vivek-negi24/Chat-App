import express from 'express';
import { protectRoute } from "../middleware/auth.middleware.js";
import { getUsersForSiderbar ,getMessages ,sendMessage, uploadImage} from '../controllers/message.controller.js';
import upload from '../middleware/multer.js';


const router = express.Router();

router.get("/users",protectRoute,getUsersForSiderbar)
router.get("/:id",protectRoute,getMessages)

// router.post("/send/:id",protectRoute,sendMessage)

router.post("/send",protectRoute,upload.single("image"),sendMessage)

router.get("/uploads/:filename",uploadImage)

// router.get("/images")

export default router;