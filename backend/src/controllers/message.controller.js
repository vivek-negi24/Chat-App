import User from "../models/user.models.js";
import Message from "../models/message.models.js";
import { getReceiverSocketId ,io} from "../lib/socket.js";

export const getUsersForSiderbar = async (req, res) => {
    try {
        const LoggedInUserId=req.user._id;
        const filteredUser=await User.find({_id:{$ne:LoggedInUserId}}).select("-password");

        res.status(200).json(filteredUser);
    } catch (error) {
        console.log("error in getUsersForSiderbar",error.message);
        res.status(500).json({message:"Internal server error"});
    }
}


export const getMessages = async (req, res) => {
    try {
      const {id:userToChatId} = req.params
      const myId=req.user._id
      const messages=await Message.find({
        $or:[
            {senderId:myId,receiverId:userToChatId},
            {senderId:userToChatId,receiverId:myId}
        ]
      })
      res.status(200).json(messages)
    } catch (error) {
        console.log("error in getMessages",error.message);
        res.status(500).json({message:"Internal server error"});
    }
}




export const sendMessage = async (req, res) => {
    try {

      // if (!req.file) {
      //   return res.status(400).send({ message: "No image file uploaded" });
      // }

      console.log("Request body:", req.body);
      console.log("Uploaded file:", req.file);

      const { text, receiverId } = req.body;
      const senderId = req.user._id;
      
      if (!text?.trim() && !req.file) {
        return res.status(200).json({ message: "Message must have text or image" });
      }

      if (!receiverId) {
        console.log("Missing receiverId:", receiverId);
        return res.status(400).json({ message: "receiverId is required" });
      }

      let imageUrl =null;

      if (req.file) {
        imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

        
      }
      
      console.log("Image URL in Backend:", imageUrl); // debug
      // Saving it in db
      const newMessage = new Message({
        senderId,
        receiverId,
        text,
        image: imageUrl,
      });
  
      await newMessage.save();
      res.status(201).json(newMessage);
     
    const receiverSocketId = getReceiverSocketId(receiverId)
    if(receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage",newMessage)
    }
    
    const senderSocketId = getReceiverSocketId(senderId);

    if (senderSocketId) {
      io.to(senderSocketId).emit("newMessage", newMessage); // Emit to sender
  }
  
    
    } catch (error) {
      console.log("Error in sendMessage controller: ", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  };


  export const uploadImage = async  (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, "../../uploads", filename);
  
    res.sendFile(filePath, (err) => {
      if (err) {
        res.status(404).json({ message: "Image not found" });
      }
    });
  };