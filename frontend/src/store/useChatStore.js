import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUserLoading: false,
  isMessageLoading: false,

  getUsers: async () => {
    set({ isUserLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUserLoading: false });
    }
  },
  // addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),//

  getMessages: async (chatroomId) => {
    set({ isMessageLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${chatroomId}`); // user
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessageLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const {  messages } = get();
    const socket = useAuthStore.getState().socket;

    try {
      const res = await axiosInstance.post(`/messages/send`, messageData);

      const newMessage = {
        ...res.data,
        image: res.data.image || null,
      };
      
      
      const isDuplicate = messages.some((msg) => msg._id === newMessage._id);
      if (!isDuplicate) {
        set({ messages: [...messages, newMessage] });
      }

    
    // const socket = useAuthStore.getState().socket;
    socket.emit("sendMessage", newMessage);
    
      // set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message")
    }
  },

  // subscribeToMessages: () => {
  //   const { selectedUser } = get();
  //   if (!selectedUser) return;
  //   const socket = useAuthStore.getState().socket;
    
  //   socket.on("newMessage", (newMessage) => {

      
  //     // const authUser = useAuthStore.getState().authUser;
  //     // const { selectedUser } = get();

     
  //     const isMessageSentFromSelectedUser =  newMessage.senderId === selectedUser?._id || newMessage.receiverId === selectedUser?._id;

  //       if (!isMessageSentFromSelectedUser ) return;
        


  //     const updatedMessage = {
  //       ...newMessage,
  //       image: newMessage.image ? `http://localhost:3000${newMessage.image}` : null,
  //     };

  //     console.log("path",newMessage.image)
  //     // if (newMessage.senderId === authUser._id) return;
   
  //     const messages = get().messages;
  //     const isDuplicate = messages.some((msg) => msg._id === updatedMessage._id);
  //     if (!isDuplicate) {
  //       set({ messages: [...messages, updatedMessage] });
  //     }

  //     // set({
  //     //   messages: [...get().messages, updatedMessage],
  //     // });
  //   });
  // },
  subscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;
  
    socket.on("newMessage", (newMessage) => {
      const { selectedUser, messages } = get();
      const authUser = useAuthStore.getState().authUser;
  
      // Add host prefix if image path is present
      const updatedMessage = {
        ...newMessage,
        image: newMessage.image || null,
      };
  
      const isRelevant =
        updatedMessage.senderId === selectedUser?._id ||
        updatedMessage.receiverId === selectedUser?._id;
  
      if (!isRelevant) return;
  
      const alreadyExists = messages.some((msg) => msg._id === updatedMessage._id);
      if (alreadyExists) return;
  
      set({
        messages: [...messages, updatedMessage],
      });
    });
  },
  
  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  setSelectedUser: (user) => {
    console.log("Setting selectedUser in store:", user);
    set({ selectedUser :user });
    console.log("🧠 After set, selectedUser:", get().selectedUser);
  },


  
}),



);
