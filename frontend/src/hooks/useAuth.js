import { create } from "zustand";
import axiosInstance from "../lib/axios";

const useAuth = create((set) => ({
  authUser: null,

  isSigningUp: false,
  isLoggingIng: false,
  isLoggingOut: false,
  isUpdatingProfile: false,

  isCheckingAuth: true,

  checkAuth: async () => {
    try {
      const response = await axiosInstance.get("/auth/check");
      set({
        authUser: response?.data,
      });
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
        authUser: response.data,
      });
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
        authUser: response.data,
      });
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
