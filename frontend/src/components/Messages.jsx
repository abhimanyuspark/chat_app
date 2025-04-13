import React, { useEffect, useRef } from "react";
import useChatStore from "../hooks/useChatStore";
import { Avatar, ChatSkeleton, SendMessageBox } from "../components";
import useAuth from "../hooks/useAuth";
import { FiMoreHorizontal } from "./Icons";
import { formatDate } from "../utils/utils";

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
        <li
          onClick={async () => {
            await deleteMessages();
          }}
        >
          <p className="p-2 text-md">Clear Chat</p>
        </li>
      </ul>
    </div>
  );
};

const Chat = () => {
  const { messages } = useChatStore();
  const { authUser } = useAuth();

  const messageEndRef = useRef(null);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="">
      {messages?.map((d, i) => {
        if (d?.senderId === authUser?._id) {
          return (
            <div ref={messageEndRef} className="chat chat-end" key={i}>
              <div className="chat-header">{formatDate(d?.createdAt)}</div>

              <div className="chat-bubble bg-primary text-primary-content">
                {d?.image && (
                  <img
                    src={d?.image}
                    alt="image"
                    className="size-50 rounded object-cover"
                  />
                )}
                {d?.text}
              </div>
            </div>
          );
        } else {
          return (
            <div ref={messageEndRef} className="chat chat-start" key={i}>
              <div className="chat-header">{formatDate(d?.createdAt)}</div>

              <div className="chat-bubble bg-neutral text-neutral-content">
                {d?.image && (
                  <img
                    src={d?.image}
                    alt="image"
                    className="size-50 rounded object-cover"
                  />
                )}
                {d?.text}
              </div>
            </div>
          );
        }
      })}
    </div>
  );
};

export default Messages;
