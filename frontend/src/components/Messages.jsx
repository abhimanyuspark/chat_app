import React, { useEffect, useRef } from "react";
import useChatStore from "../hooks/useChatStore";
import { Avatar, ChatSkeleton, SendMessageBox } from "../components";
import useAuth from "../hooks/useAuth";
import { FiMoreHorizontal } from "./Icons";
import { formatDate } from "../utils/utils";
import { FiDownload } from "react-icons/fi";
import { saveAs } from "file-saver";

const Messages = () => {
  const {
    messages,
    isMessageLoading,
    getMessages,
    selectedUser,
    subscribeToMessage,
    unSubscribeToMessage,
  } = useChatStore();

  useEffect(() => {
    getMessages(selectedUser?._id);

    subscribeToMessage();

    return () => {
      unSubscribeToMessage();
    };
  }, [
    getMessages,
    selectedUser?._id,
    unSubscribeToMessage,
    subscribeToMessage,
  ]);

  let content = null;

  if (isMessageLoading) {
    content = <ChatSkeleton />;
  } else if (messages.length > 0) {
    content = <Chat />;
  } else {
    content = (
      <p className="text-sm text-center text-accent">Start chatting here...</p>
    );
  }

  return (
    <div className="">
      <Header />
      <div className="bg-base-100 p-2 h-[calc(100vh-11.2rem)] overflow-auto scroll-smooth scroll">
        {content}
      </div>
      <SendMessageBox />
    </div>
  );
};

const Header = () => {
  const { selectedUser } = useChatStore();
  const { onlineUsers } = useAuth();

  return (
    <div className="flex justify-between items-center bg-base-300 py-2 px-3 z-10 top-0 left-0 w-full">
      <div className="flex items-center gap-2 ">
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

      <Menu />
    </div>
  );
};

const Menu = () => {
  const { selectUser, deleteMessages } = useChatStore();

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
        className="menu menu-sm dropdown-content bg-base-300 rounded-box z-1 mt-3 w-52 p-2 shadow *"
      >
        <li
          onClick={() => {
            selectUser(null);
          }}
        >
          <p className="p-2 text-md">Close Chat</p>
        </li>
        {/* <li
          onClick={async () => {
            await deleteMessages();
          }}
        >
          <p className="p-2 text-md">Clear Chat</p>
        </li> */}
      </ul>
    </div>
  );
};

const Chat = () => {
  const { messages } = useChatStore();
  const { authUser } = useAuth();

  const messageEndRef = useRef(null);

  const isSender = (d) => d?.senderId === authUser?._id;

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="">
      {messages?.map((d, i) => {
        if (isSender(d)) {
          return (
            <div ref={messageEndRef} className="chat chat-end" key={i}>
              <Content d={d} isSender={isSender} />
            </div>
          );
        } else {
          return (
            <div ref={messageEndRef} className="chat chat-start" key={i}>
              <Content d={d} isSender={isSender} />
            </div>
          );
        }
      })}
    </div>
  );
};

const Content = ({ d, isSender }) => {
  const onDownloadImage = (imageUrl, fileName = "downloaded-image") => {
    saveAs(imageUrl, fileName); // Put your image URL here.
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
      >
        {d?.image && (
          <div className="size-50 rounded object-cover relative group/item transition-all">
            <img src={d?.image} alt="image" className="size-full" />

            <div className="group-hover/item:visible invisible absolute top-0 left-0 size-full bg-[rgba(0,0,0,0.5)] flex items-center justify-center cursor-pointer">
              <button
                type="button"
                className="btn btn-accent text-accent-content"
                onClick={() => onDownloadImage(d?.image, "chat-image")}
              >
                <FiDownload className="size-5" />
              </button>
            </div>
          </div>
        )}
        {d?.text}
      </div>
    </>
  );
};

export default Messages;
