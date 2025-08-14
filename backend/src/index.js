import express from 'express';
import dotenv from 'dotenv';
import path from "path";
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import chatroomRoutes from './routes/chatroom.route.js'

import {connectDB} from './lib/db.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import {app,server} from "./lib/socket.js"


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const PORT =process.env.PORT 


app.use(express.json())
app.use(cookieParser())
app.use(
    cors({
    origin:"http://localhost:5173",
    credentials:true,
}))

app.use("/api/auth",authRoutes);
app.use("/api/messages",messageRoutes);
app.use("/api", messageRoutes); 
app.use("/api/chatroom",chatroomRoutes);
app.use("/uploads",express.static(path.join(__dirname,"../uploads"), {
    setHeaders: (res) => {
      res.set('Access-Control-Allow-Origin', '*');
    }
  }))

// app.use(express.json({ limit: "10mb" }));
// app.use(express.urlencoded({ extended: true, limit: "10mb" }));

server.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}` )
    connectDB()
})