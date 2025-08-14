import React, { useRef, useState } from 'react'
import { useChatStore } from '../store/useChatStore'
import { Image, Send, X } from "lucide-react";
import toast from "react-hot-toast";

import axiosInstance from "../lib/axios";
const MessageInput = () => {
  const[text,setText]=useState("")
  const[imagePreview,setImagePreview]=useState("")
  const fileInputRef=useRef(null)
  const{sendMessage ,selectedUser}=useChatStore()
  // console.log(sendMessage); // Should log the function, not `undefined`
  const [selectedImageFile, setSelectedImageFile] = useState(null);

  const handleImageChange=(e)=>{
    const file=e.target.files[0]

    if (!file) {
      toast.error("No file selected");
      return;
    }

    if(!file.type.startsWith("image/")){
      toast.error("Please select an valid image file")
      return
    }

    
    const reader = new FileReader();
    reader.onload=()=>{
      setImagePreview(reader.result);
      setSelectedImageFile(file); // store it in state //
    }
    reader.readAsDataURL(file)
  }

  const removeImage=()=>{
    setImagePreview(null)
    setSelectedImageFile(null); // store it in state //

    if(fileInputRef.current) fileInputRef.current.value=""
      
  }


  const handleSendMessage = async (e) => {
    e.preventDefault();
  
    if (!text.trim() && !fileInputRef.current.files[0]) return;
  
    const formData = new FormData();
    
    if (text.trim()) {
      formData.append("text", text.trim());
    }

    if (!text.trim() && !fileInputRef.current.files[0]) {///
      toast.error("Please add text or an image before sending");
      return;
    }
    
 
    formData.append("receiverId", selectedUser._id);
  
    
    if (selectedImageFile) {
      formData.append("image", selectedImageFile); // ✅ uses file stored in state
    }
    console.log("FormData entries:", [...formData.entries()]);
  
    try {
      const response = await axiosInstance.post("/messages/send", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      await sendMessage(response.data);
  
      setText("");
      setSelectedImageFile(null); // ✅ reset
      fileInputRef.current.value = "";
      setImagePreview(null);
  
      console.log("Message sent:", response.data);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };
  
  
  return (
    <div className="p-4 w-full">
    {imagePreview && (
      <div className="mb-3 flex items-center gap-2">
        <div className="relative">
          <img
            src={imagePreview}
            alt="Preview"
            className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
          />
          <button
            onClick={removeImage}
            className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
            flex items-center justify-center"
            type="button"
          >
            <X className="size-3" />
          </button>
        </div>
      </div>
    )}

    <form onSubmit={handleSendMessage} className="flex items-center gap-2">
      <div className="flex-1 flex gap-2">
        <input
          type="text"
          className="w-full input input-bordered rounded-lg input-sm sm:input-md"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleImageChange}
        />

        <button
          type="button"
          className={`hidden sm:flex btn btn-circle
                   ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
          onClick={() => fileInputRef.current?.click()}
        >
          <Image size={20} />
        </button>
      </div>
      <button
        type="submit"
        className="btn btn-sm btn-circle"
        disabled={!text.trim() && !imagePreview}
      >
        <Send size={22} />
      </button>
    </form>
  </div>
  )
}

export default MessageInput
