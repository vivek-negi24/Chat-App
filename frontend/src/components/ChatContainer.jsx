
// const API_URL = import.meta.env.VITE_API_URL;

import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef } from "react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkelton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
const messages = useChatStore((state) => state.messages);
const getMessages = useChatStore((state) => state.getMessages);
const isMessagesLoading = useChatStore((state) => state.isMessageLoading);
const selectedUser = useChatStore((state) => state.selectedUser);
const subscribeToMessages = useChatStore((state) => state.subscribeToMessages);
const unsubscribeFromMessages = useChatStore((state) => state.unsubscribeFromMessages);

  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);
  
 
  useEffect(() => {
    if (!selectedUser?._id) return;
  
    getMessages(selectedUser._id);
    subscribeToMessages();
    
    return () => unsubscribeFromMessages();
  }, [selectedUser?._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);
  
  useEffect(() => {
    console.log("👀 ChatContainer saw selectedUser:", selectedUser);
  }, [selectedUser]);
  

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);



  if (!selectedUser) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-500">No chat selected</p>
      </div>
    );
  }

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) =>{
          console.log("Message Image:", message.image);
          return(  
          <div
            key={message._id}
            className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
            ref={messageEndRef}
          >
            <div className=" chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || "/avatar.png"
                      : selectedUser.profilePic || "/avatar.png"
                  }
                  alt="profile pic"
                />
              </div>

            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            <div className="chat-bubble flex flex-col">
          
              {message.image && (
                <img
                
                  src={message.image}

                  
                 
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
                
              )} 
              {message.text?.trim() && <p>{message.text}</p>}
              
            </div>
          </div>
        )})}
      </div>

      <MessageInput />
    </div>
  );
};
export default ChatContainer;