import { create } from "zustand";
import axiosInstance from "../lib/axios";
import useAuth from "./useAuth";
import notificationAudio from "../../public/notification.wav";

const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isMessageLoading: false,
  isUsersLoading: false,
  unreadMessages: {},
  windowFocused: true,

  // Set window focus status
  setWindowFocus: (isFocused) => {
    set({ windowFocused: isFocused });
  },

  // Mark messages as read
  markMessagesAsRead: (userId) => {
    set((state) => {
      const updatedUnreadMessages = { ...state.unreadMessages };
      updatedUnreadMessages[userId] = 0;
      return { unreadMessages: updatedUnreadMessages };
    });

    if (document.title.includes("New message")) {
      document.title = "Chat App";
    }
  },

  // Get messages for the selected user
  getMessages: async (id) => {
    set({ isMessageLoading: true });
    try {
      const res = await axiosInstance.get(`/message/${id}`);
      set({ messages: res.data });
      get().markMessagesAsRead(id);
    } catch (error) {
      console.error("getting messages: " + error);
    } finally {
      set({ isMessageLoading: false });
    }
  },

  // Send a new message
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
      console.error("send Message: " + error);
    }
  },

  // Get users
  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/message/users");
      set({ users: res?.data });
    } catch (error) {
      console.error("getting users: " + error);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  // Select a user for chat
  selectUser: (user) => {
    set({ selectedUser: user });
    if (user) {
      get().markMessagesAsRead(user._id);
    }
  },

  // Subscribe to real-time messages
  subscribeToMessage: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuth.getState().socket;

    socket.on("newMessage", (newMessage) => {
      const { windowFocused } = get();

      if (newMessage?.senderId === selectedUser?._id) {
        set({ messages: [...get().messages, newMessage] });
        if (windowFocused) {
          get().markMessagesAsRead(selectedUser._id);
        } else {
          get().handleNewMessageNotification(newMessage, selectedUser);
        }
      } else {
        const sender = get().users.find(
          (user) => user._id === newMessage.senderId
        );
        if (sender) {
          set((state) => {
            const updatedUnreadMessages = { ...state.unreadMessages };
            updatedUnreadMessages[sender._id] =
              (updatedUnreadMessages[sender._id] || 0) + 1;
            return { unreadMessages: updatedUnreadMessages };
          });

          get().handleNewMessageNotification(newMessage, sender);
        }
      }
    });
  },

  // Handle new message notifications
  handleNewMessageNotification: (message, sender) => {
    const { windowFocused } = get();

    const notificationSound = new Audio(notificationAudio);
    notificationSound.play().catch((err) => {
      console.log("Error playing sound", err);
    });

    const totalUnreadCount = Object.values(get().unreadMessages).reduce(
      (a, b) => a + b,
      0
    );

    if (totalUnreadCount > 0 && !windowFocused) {
      document.title = `(${totalUnreadCount}) New message - Chat App`;
    }

    if (Notification.permission === "granted" && !windowFocused) {
      new Notification(`New message from ${sender.fullName}`, {
        body: message.text
          ? message.text.substring(0, 50)
          : "New image message",
        icon: sender.profilePic || "/default-avatar.png",
      });
    }
  },

  // Unsubscribe from real-time messages
  unSubscribeToMessage: () => {
    const socket = useAuth.getState().socket;
    socket.off("newMessage");
  },

  // Delete selected messages for the user
  deleteMessagesForMe: async (messageIds) => {
    try {
      await axiosInstance.put("/message/delete-for-me", { messageIds });
      set((state) => ({
        messages: state.messages.filter((msg) => !messageIds.includes(msg._id)),
      }));
    } catch (err) {
      console.error("Delete for me failed:", err);
    }
  },

  // Delete selected messages for everyone
  deleteMessagesForEveryone: async (messageIds) => {
    try {
      await axiosInstance.put("/message/delete-for-everyone", { messageIds });
      set((state) => ({
        messages: state.messages.map((msg) =>
          messageIds.includes(msg._id)
            ? {
                ...msg,
                text: "[Deleted]",
                image: null,
                deletedForEveryone: true,
              }
            : msg
        ),
      }));
    } catch (err) {
      console.error("Delete for everyone failed:", err);
    }
  },
}));

export default useChatStore;
