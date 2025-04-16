import { create } from "zustand";
import axiosInstance from "../lib/axios";
import useAuth from "./useAuth";

const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isMessageLoading: false,
  isUsersLoading: false,

  getMessages: async (id) => {
    set({
      isMessageLoading: true,
    });
    try {
      const res = await axiosInstance.get(`/message/${id}`);
      set({
        messages: res.data,
      });
    } catch (error) {
      console.error("geting users : " + error);
    } finally {
      set({
        isMessageLoading: false,
      });
    }
  },

  sendMessage: async (data) => {
    const { selectedUser } = get();
    try {
      const res = await axiosInstance.post(
        `/message/send/${selectedUser?._id}`,
        data
      );
      set({ messages: [...get().messages, res.data] });
      return res;
    } catch (error) {
      console.error("send Message : " + error);
    }
  },

  deleteMessages: async () => {
    const { selectedUser } = get();
    set({
      isMessageLoading: true,
    });
    try {
      await axiosInstance.delete(`/message/clear-chat/${selectedUser?._id}`);
      // Clear the messages state since all messages with the selected user are deleted
      set({
        messages: [],
        selectedUser: null,
      });
    } catch (error) {
      console.error("deleteMessages: " + error);
    } finally {
      set({
        isMessageLoading: false,
      });
    }
  },

  getUsers: async () => {
    set({
      isUsersLoading: true,
    });
    try {
      const res = await axiosInstance.get("/message/users");
      set({
        users: res?.data,
      });
    } catch (error) {
      console.error("geting users : " + error);
    } finally {
      set({
        isUsersLoading: false,
      });
    }
  },

  selectUser: (user) => {
    set({ selectedUser: user });
  },

  subscribeToMessage: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuth.getState().socket;

    socket.on("newMessage", (newMessage) => {
      if (newMessage?.senderId !== selectedUser?._id) return;
      set({
        messages: [...get().messages, newMessage],
      });
    });
  },

  unSubscribeToMessage: () => {
    const socket = useAuth.getState().socket;
    socket.off("newMessage");
  },
}));

export default useChatStore;
