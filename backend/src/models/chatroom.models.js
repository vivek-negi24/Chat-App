import mongoose from "mongoose";

const chatroomSchema = mongoose.Schema(
    {
       
        roomId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Chatroom",
            required: true,
            default: new mongoose.Types.ObjectId() 
           
        },
         senderId: {
             type: mongoose.Schema.Types.ObjectId,
              ref: "User",
              required: true,
            },
            receiverId: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "User",
              required: true,
            },

            text: {
                type: String,
              },
              image: {
                type: String,
              },



    },{timestamps:true}
)
// Add a compound index to ensure unique chat rooms for each pair of users
chatroomSchema.index({ senderId: 1, receiverId: 1 }, { unique: true });

export const Chatroom = mongoose.model("Chatroom",chatroomSchema)
export default Chatroom

// {
//     id:2343
//     charoomid:34343534545,
//     senderid:343434
//     reciver:9384934,
//     msg:"34343434"

// }