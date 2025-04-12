import { create } from "zustand";
import axiosInstance from "../lib/axios";

const useChatStore = create((set) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isMessageLoading: false,
  isUsersLoading: false,

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

  sendMessage: async (id, data) => {
    set({
      isMessageLoading: true,
    });
    try {
      const res = await axiosInstance.post(`/message/${id}`, data);
      set({ messages: messages.push(res.data) });
      return res;
    } catch (error) {
      console.error("send Message : " + error);
    } finally {
      set({
        isMessageLoading: false,
      });
    }
  },
}));

export default useChatStore;
