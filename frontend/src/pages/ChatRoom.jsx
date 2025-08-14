// src/pages/ChatRoomPage.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import Sidebar from "../components/Sidebar";
import ChatContainer from "../components/ChatContainer";
import axios from "axios";
import io from 'socket.io-client';

const socket = io("http://localhost:3000");

const ChatRoomPage = () => {
  const { id: chatroomId } = useParams();
  // const { setSelectedUser } = useChatStore();
  const setSelectedUser = useChatStore((state) => state.setSelectedUser);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");

  useEffect(() => {
    const fetchChatroom = async () => {
      try {
        const res = await axios.get(`/api/chatroom/${chatroomId}`);
        console.log("📦 API Response:", res.data);
        const { receiver, messages: chatMessages } = res.data;
        setSelectedUser(receiver);
        setMessages(chatMessages);
      } catch (err) {
        console.error("Failed to fetch chatroom info:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchChatroom();

    // Listen for new messages from other users
    socket.on("newMessage", (newMessage) => {
      console.log("New message received:", newMessage); ///
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socket.off("newMessage");
    };
  }, [chatroomId, setSelectedUser]);
  

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim()) return; // Do nothing if the message is empty

    const formData = new FormData();
    formData.append("text", text);
    formData.append("receiverId", chatroomId); // Use chatroomId as the receiverId

    try {
      // Send message to the server
      const res = await axios.post("/api/messages/send", formData);

      // Emit the new message to Socket.io for real-time updates
      socket.emit("newMessage", res.data);

      setText(""); // Clear the input after sending the message
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-xl font-semibold">
        Loading chat...
      </div>
    );
  }

  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <Sidebar />
            <ChatContainer messages={messages} handleSendMessage={handleSendMessage} text={text} setText={setText}  />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatRoomPage;
