import {Server} from "socket.io"
import http from "http"
import express from "express"

const app=express()
const server=http.createServer(app)

const io= new Server(server,{
    cors:{
        origin:["http://localhost:5173"],
    }
})

export function getReceiverSocketId(userId) {
    return userSocketMap[userId]
}
// use to store online user
const userSocketMap={} // {userId:socketId}

io.on("connection",(socket)=>{
    console.log("A user Connected",socket.id)

    const userId=socket.handshake.query.userId;
    if(userId) userSocketMap[userId]=socket.id;


    io.emit("getOnlineUsers",Object.keys(userSocketMap))

    socket.on("sendMessage", (message) => {
        // Broadcast the message to the receiver and the sender
        io.to(message.receiverId).emit("newMessage", message);
        io.to(message.senderId).emit("newMessage", message);
      });

    socket.on("disconnect",()=>{
        console.log("A user disconnected",socket.id)
        delete userSocketMap[userId]
        io.emit("getOnlineUsers",Object.keys(userSocketMap))
    })
})

export {io,app, server}