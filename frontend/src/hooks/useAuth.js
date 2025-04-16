import { create } from "zustand";
import axiosInstance from "../lib/axios";
import { io } from "socket.io-client";

const url = "http://localhost:3000";

const useAuth = create((set, get) => ({
  authUser: null,

  isSigningUp: false,
  isLoggingIng: false,
  isLoggingOut: false,
  isUpdatingProfile: false,

  isCheckingAuth: true,

  onlineUsers: [],

  socket: null,

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) {
      return;
    }

    const socket = io(url, {
      query: {
        userId: authUser?._id,
      },
    });
    socket.connect();

    set({ socket: socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },

  disConnectSocket: () => {
    if (get().socket?.connected) get().socket?.disconnect();
  },

  checkAuth: async () => {
    try {
      const response = await axiosInstance.get("/auth/check");
      set({
        authUser: response?.data,
      });
      get().connectSocket();
    } catch (error) {
      console.log("useAuth check Error" + error);
      set({
        authUser: null,
      });
    } finally {
      set({
        isCheckingAuth: false,
      });
    }
  },

  signUp: async (formData) => {
    set({ isSigningUp: true });
    try {
      const response = await axiosInstance.post("/auth/signup", formData);
      set({
        authUser: response?.data,
      });
      get().connectSocket();
      return response;
    } catch (error) {
      console.log("useAuth signup Error : " + error);
      set({ authUser: null });
      return error.response.data;
    } finally {
      set({ isSigningUp: false });
    }
  },

  logIn: async (formData) => {
    set({ isLoggingIng: true });
    try {
      const response = await axiosInstance.post("/auth/login", formData);
      set({
        authUser: response?.data,
      });
      get().connectSocket();
      return response;
    } catch (error) {
      console.log("useAuth login Error : " + error);
      set({ authUser: null });
      return error.response.data;
    } finally {
      set({ isLoggingIng: false });
    }
  },

  logOut: async () => {
    set({ isLoggingOut: true });
    try {
      const res = await axiosInstance.post("/auth/logout");
      set({
        authUser: null,
      });
      get().disConnectSocket();
      return res;
    } catch (error) {
      console.log("useAuth logout Error" + error);
      return error.response.data.message;
    } finally {
      set({ isLoggingOut: false });
    }
  },

  updateProfile: async (data) => {
    set({
      isUpdatingProfile: true,
    });
    try {
      const response = await axiosInstance.post("/auth/profile", data);
      set({
        authUser: response.data,
      });
      return response;
    } catch (error) {
      console.log("useAuth update profile pic Error " + error);
      return error.response.data;
    } finally {
      set({
        isUpdatingProfile: false,
      });
    }
  },
}));

export default useAuth;
