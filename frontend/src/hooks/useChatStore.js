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
  unreadMessages: {}, // Track unread messages by user ID
  windowFocused: true, // Track if window is focused

  // Set window focus state
  setWindowFocus: (isFocused) => {
    set({ windowFocused: isFocused });
  },

  // Mark messages as read for a specific user
  markMessagesAsRead: (userId) => {
    set((state) => {
      const updatedUnreadMessages = { ...state.unreadMessages };
      updatedUnreadMessages[userId] = 0;
      return { unreadMessages: updatedUnreadMessages };
    });

    // Reset document title if this was the user causing notifications
    if (document.title.includes("New message")) {
      document.title = "Chat App";
    }
  },

  getMessages: async (id) => {
    set({
      isMessageLoading: true,
    });
    try {
      const res = await axiosInstance.get(`/message/${id}`);
      set({
        messages: res.data,
      });

      // Mark messages as read when fetched
      get().markMessagesAsRead(id);
    } catch (error) {
      console.error("getting messages: " + error);
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
      console.error("send Message: " + error);
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
      console.error("getting users: " + error);
    } finally {
      set({
        isUsersLoading: false,
      });
    }
  },

  selectUser: (user) => {
    set({ selectedUser: user });

    // When selecting a user, mark their messages as read
    if (user) {
      get().markMessagesAsRead(user._id);
    }
  },

  subscribeToMessage: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuth.getState().socket;

    socket.on("newMessage", (newMessage) => {
      const { windowFocused } = get();

      // Add message to state if it's from the selected user
      if (newMessage?.senderId === selectedUser?._id) {
        set({
          messages: [...get().messages, newMessage],
        });

        // Only mark as read if window is focused
        if (windowFocused) {
          get().markMessagesAsRead(selectedUser._id);
        } else {
          // Play notification sound and update unread count
          get().handleNewMessageNotification(newMessage, selectedUser);
        }
      } else {
        // Message from another user - handle notifications
        const sender = get().users.find(
          (user) => user._id === newMessage.senderId
        );
        if (sender) {
          // Update unread count for this sender
          set((state) => {
            const updatedUnreadMessages = { ...state.unreadMessages };
            updatedUnreadMessages[sender._id] =
              (updatedUnreadMessages[sender._id] || 0) + 1;
            return { unreadMessages: updatedUnreadMessages };
          });

          // Trigger notification for message from non-active chat
          get().handleNewMessageNotification(newMessage, sender);
        }
      }
    });
  },

  handleNewMessageNotification: (message, sender) => {
    const { windowFocused } = get();

    // Play notification sound
    const notificationSound = new Audio(notificationAudio); // Create this file in your public folder
    notificationSound
      .play()
      .catch((err) => console.log("Error playing sound", err));

    // Update document title with unread count
    const totalUnreadCount = Object.values(get().unreadMessages).reduce(
      (a, b) => a + b,
      0
    );
    if (totalUnreadCount > 0 && !windowFocused) {
      document.title = `(${totalUnreadCount}) New message - Chat App`;
    }

    // Show browser notification if permitted
    if (Notification.permission === "granted" && !windowFocused) {
      new Notification(`New message from ${sender.fullName}`, {
        body: message.text
          ? message.text.substring(0, 50)
          : "New image message",
        icon: sender.profilePic || "/default-avatar.png", // Ensure you have a default avatar
      });
    }
  },

  unSubscribeToMessage: () => {
    const socket = useAuth.getState().socket;
    socket.off("newMessage");
  },
}));

export default useChatStore;
