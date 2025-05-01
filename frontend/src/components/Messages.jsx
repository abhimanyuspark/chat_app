import React, { useEffect, useState, useRef } from "react";
import useChatStore from "../hooks/useChatStore";
import useAuth from "../hooks/useAuth";
import { Avatar, ChatSkeleton, SendMessageBox } from "../components";
import { FiMoreHorizontal, FiArrowLeft, FiDownload } from "./Icons";
import { formatDate } from "../utils/utils";
import { saveAs } from "file-saver";

const Messages = () => {
  const {
    messages,
    isMessageLoading,
    getMessages,
    selectedUser,
    subscribeToMessage,
    unSubscribeToMessage,
    setWindowFocus,
    markMessagesAsRead,
    deleteMessagesForMe,
    deleteMessagesForEveryone,
    unreadMessages,
  } = useChatStore();

  const [selectedMessages, setSelectedMessages] = useState([]);
  const messageEndRef = useRef(null);

  // Request notification permission
  useEffect(() => {
    if (
      Notification.permission !== "granted" &&
      Notification.permission !== "denied"
    ) {
      Notification.requestPermission().catch((err) =>
        console.error("Notification permission error:", err)
      );
    }
  }, []);

  // Handle window focus and blur events
  useEffect(() => {
    const handleFocus = () => {
      setWindowFocus(true);
      if (selectedUser?._id) {
        markMessagesAsRead(selectedUser._id);
      }
    };

    const handleBlur = () => {
      setWindowFocus(false);
    };

    window.addEventListener("focus", handleFocus);
    window.addEventListener("blur", handleBlur);

    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("blur", handleBlur);
    };
  }, [setWindowFocus, markMessagesAsRead, selectedUser?._id]);

  // Fetch messages and manage subscriptions
  useEffect(() => {
    if (selectedUser?._id) {
      getMessages(selectedUser._id);
    }
    subscribeToMessage();

    return () => {
      unSubscribeToMessage();
    };
  }, [
    getMessages,
    selectedUser?._id,
    subscribeToMessage,
    unSubscribeToMessage,
  ]);

  // Scroll to the latest message
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const toggleMessageSelection = (id) => {
    setSelectedMessages((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const isSelected = (id) => selectedMessages.includes(id);

  let content = null;

  if (isMessageLoading) {
    content = <ChatSkeleton />;
  } else if (messages.length > 0) {
    content = (
      <Chat
        messages={messages}
        toggleMessageSelection={toggleMessageSelection}
        isSelected={isSelected}
        messageEndRef={messageEndRef}
      />
    );
  } else {
    content = (
      <p className="text-sm text-center text-accent">Start chatting here...</p>
    );
  }

  const ShowONSelect = () => {
    if (selectedMessages.length > 0) {
      return (
        <div className="flex gap-2 items-center justify-center p-2">
          <button
            type="button"
            className="btn btn-accent btn-sm text-accent-content"
            onClick={() => {
              setSelectedMessages([]);
              deleteMessagesForMe(selectedMessages);
            }}
          >
            Delete for me
          </button>
          <button
            type="button"
            className="btn btn-accent btn-sm text-accent-content"
            onClick={() => {
              setSelectedMessages([]);
              deleteMessagesForEveryone(selectedMessages);
            }}
          >
            Delete for everyone
          </button>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col h-full">
      <Header Show={ShowONSelect} />
      <div className="bg-base-100 p-2 flex-1 overflow-auto scroll-smooth">
        {content}
      </div>
      <SendMessageBox />
    </div>
  );
};

// Header component
const Header = ({ Show }) => {
  const { selectedUser, selectUser } = useChatStore();
  const { onlineUsers } = useAuth();

  return (
    <div className="flex justify-between items-center bg-base-300 py-2 px-3 z-10 top-0 left-0 w-full">
      <div className="flex items-center gap-2">
        <div onClick={() => selectUser(null)} className="cursor-pointer">
          <FiArrowLeft className="size-5" />
        </div>

        <Avatar user={selectedUser} />

        <div className="flex flex-col">
          <p className="text-sm">{selectedUser?.fullName || "Name"}</p>
          <span className="text-xs">
            {onlineUsers.includes(selectedUser?._id) ? (
              <span className="text-primary">online</span>
            ) : (
              <span className="text-gray-500">offline</span>
            )}
          </span>
        </div>
      </div>

      <Show />
      <Menu />
    </div>
  );
};

const Menu = () => {
  const { selectUser } = useChatStore();

  return (
    <div className="dropdown dropdown-end">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-ghost btn-circle avatar"
      >
        <FiMoreHorizontal />
      </div>
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-base-300 rounded-box z-1 mt-3 w-52 p-2 shadow"
      >
        <li
          onClick={() => {
            selectUser(null);
          }}
        >
          <p className="p-2 text-md">Close Chat</p>
        </li>
      </ul>
    </div>
  );
};

// Chat component to display messages
const Chat = ({
  messages,
  toggleMessageSelection,
  isSelected,
  messageEndRef,
}) => {
  const { authUser } = useAuth();

  const isSender = (d) => d?.senderId === authUser?._id;
  const deltedForMe = (d) => d?.deletedFor?.includes(authUser?._id);

  return (
    <div className="flex flex-col">
      {messages?.map((d, i) => (
        <div
          className={`chat p-0 ${isSender(d) ? "chat-end" : "chat-start"} ${
            isSelected(d._id) ? "bg-base-300" : ""
          }`}
          key={i}
          ref={i === messages.length - 1 ? messageEndRef : null}
        >
          {!deltedForMe(d) && (
            <Content
              d={d}
              isSender={isSender}
              toggleMessageSelection={toggleMessageSelection}
              isSelected={isSelected}
            />
          )}
        </div>
      ))}
    </div>
  );
};

const Content = ({ d, isSender, toggleMessageSelection, isSelected }) => {
  const onDownloadImage = (imageUrl, fileName = "downloaded-image") => {
    saveAs(imageUrl, fileName);
  };

  return (
    <>
      <div className="chat-header">{formatDate(d?.createdAt)}</div>

      <div
        className={`chat-bubble ${
          isSender(d)
            ? "bg-primary text-primary-content"
            : "bg-neutral text-neutral-content"
        }`}
        onClick={() => toggleMessageSelection(d._id)}
      >
        {d?.image && (
          <div className="size-50 rounded object-cover relative group/item transition-all">
            <img src={d?.image} alt="image" className="size-full" />

            {!isSelected(d._id) && (
              <div className="group-hover/item:visible visible sm:invisible absolute top-0 left-0 size-full bg-[rgba(0,0,0,0.5)] flex items-center justify-center cursor-pointer">
                <button
                  type="button"
                  className="btn btn-accent text-accent-content"
                  onClick={() => onDownloadImage(d?.image, "chat-image")}
                >
                  <FiDownload className="size-5" />
                </button>
              </div>
            )}
          </div>
        )}
        {d?.text}
      </div>
    </>
  );
};

export default Messages;
