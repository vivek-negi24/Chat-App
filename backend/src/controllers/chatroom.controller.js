import mongoose from "mongoose";
import Chatroom from "../models/chatroom.models.js";
import User from "../models/user.models.js"; 

export const getOrCreateChatroom = async (req,res)=>{
    const {senderId,receiverId}=req.body;
    try {
        let chatroom = await Chatroom.findOne({
            $or:[
                {senderId, receiverId},
                {senderId:receiverId,receiverId:senderId}
            ]
        })
        if(!chatroom)
        {
            chatroom=new Chatroom({
                roomId:new mongoose.Types.ObjectId(),
                senderId,
                receiverId,
            })
            await chatroom.save()
        }
        res.status(200).json(chatroom)
    } catch (error) {
        console.error("Error in getOrCreateChatroom:", error.message);
         res.status(500).json({ message: "Internal server error" });
    }
}

export const getChatroomInfo = async (req, res) => {
    try {
      console.log("req.user:", req.user);
      const chatroom = await Chatroom.findById(req.params.id);
      if (!chatroom) return res.status(404).json({ message: "Chatroom not found" });
  
      console.log("chatroom:", chatroom);
  
      const members = [chatroom.senderId.toString(), chatroom.receiverId.toString()];
      const receiverId = members.find((id) => id !== req.user._id.toString());
  
      console.log("receiverId:", receiverId);
  
      const receiver = await User.findById(receiverId).select("-password");
  
      console.log("receiver user:", receiver);
  
      res.status(200).json({ receiver });
    } catch (err) {
      console.error("getChatroomInfo error:", err.message);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  