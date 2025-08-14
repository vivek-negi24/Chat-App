# Chat App (MERN + Socket.IO)

A real-time chat application built using the **MERN stack** with **Socket.IO** for instant messaging.  
Initially integrated with **Cloudinary** for image storage, later enhanced to use **Multer** for local storage to improve speed and offline capability.

---

## 🚀 Overview

This chat app allows users to:
- Register and log in securely
- Send and receive messages in real time
- Share images and media files
- Maintain persistent conversations
- Enjoy a responsive, modern UI

The app supports **private messaging** between two users with persistent chat history stored in MongoDB.

---

## ✨ Key Features

- **User Authentication:** Secure JWT-based login/signup.
- **Real-Time Messaging:** Powered by **Socket.IO**.
- **Media Sharing:** Send images via Cloudinary (initially) or locally via Multer.
- **Local Storage Support:** Images now stored on the server for faster access.
- **Persistent Chats:** All messages stored in MongoDB.
- **Responsive UI:** Works across devices.
- **Role-Based Handling:** Different handling for authenticated vs guest users.

---

## 🧱 Tech Stack

- **Frontend:** React (Vite), Axios/Fetch, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Real-Time:** Socket.IO
- **Authentication:** JWT + HTTP-only cookies
- **File Storage:**  
  - Initial: Cloudinary (cloud storage)  
  - Enhancement: Multer (local storage)
- **Environment Management:** dotenv
- **Security:** bcryptjs for password hashing, cookie-parser

---

## 📦 Dependencies

  ```json
  "bcryptjs": "^3.0.2",
  "cloudinary": "^2.6.0",
  "cookie-parser": "^1.4.7",
  "cors": "^2.8.5",
  "dotenv": "^16.4.7",
  "express": "^5.1.0",
  "jsonwebtoken": "^9.0.2",
  "mongodb": "^6.15.0",
  "mongoose": "^8.13.2",
  "multer": "^1.4.5-lts.2",
  "socket.io": "^4.8.1"


##  🗂️ Project Structure
  frontend/                 # React + Vite app
  backend/                  # Express API
   └── src/
       ├── models/          # User, Message
       ├── routes/          # /auth, /messages, /upload
       ├── controllers/     # Route logic
       ├── middlewares/     # auth, upload handlers
       ├── config/          # DB & socket configuration
       └── utils/           # helper functions
  uploads/                  # Local media storage (via Multer)

## 🔐 Environment Variables

  Create a .env file in your backend directory:
  
  # MongoDB
  MONGODB_URI=mongodb://localhost:27017/mydatabase
  # or for Atlas:
  # mongodb+srv://<username>:<password>@cluster.mongodb.net/mydatabase?retryWrites=true&w=majority
  
  # Server
  PORT=3000
  NODE_ENV=development
  
  # JWT Secret
  JWT_SECRET=your_jwt_secret_here
  
  # Cloudinary (optional - if using)
  CLOUDINARY_CLOUD_NAME=your_cloud_name
  CLOUDINARY_API_KEY=your_api_key
  CLOUDINARY_API_SECRET=your_api_secret
  
  # Frontend URL
  VITE_API_URL=http://localhost:3000

##   ▶️ Getting Started
  Prerequisites
  
  Node.js (LTS)
  
  npm or yarn
  
  MongoDB (local or Atlas)
  
  Installation
  
  Backend
  
    cd backend
    npm install
    npm run dev


  Frontend
  
    cd frontend
    npm install
    npm run dev

📌 Enhancement: Cloudinary → Multer

  Originally, uploaded images were stored in Cloudinary (cloud storage).
  Now, using Multer, media is stored locally in the /uploads directory, which:
  
  Speeds up file delivery
  
  Allows offline/local testing
  
  Reduces dependency on external APIs

🔮 Future Enhancements

  Group Chats: Create rooms for multiple participants.
  
  Read Receipts: Show when a message is seen.
  
  Typing Indicators: Real-time “user is typing…” feedback.
  
  Voice & Video Calls: WebRTC integration.
  
  Message Reactions: Emojis and quick reactions to messages.
  
  Message Search: Search by keywords in chat history.
  
  File Sharing: Support for PDFs, docs, and more.
  
  Push Notifications: Browser & mobile alerts for new messages.
