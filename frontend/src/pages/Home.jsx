import React from "react";
import { Messages, SendMessageBox } from "../components";
import { FiMessageSquare, FiMoreHorizontal } from "../components/Icons";
import useChatStore from "../hooks/useChatStore";

const Home = () => {
  const { selectedUser } = useChatStore();

  return (
    <>
      {selectedUser ? (
        <div>
          <Header />
          <Content />
          <SendMessageBox />
        </div>
      ) : (
        <NoMessages />
      )}
    </>
  );
};

const Header = () => {
  const { selectedUser } = useChatStore();

  return (
    <div className="flex justify-between items-center bg-base-300 py-2 px-3 rounded-md sticky z-10 top-0 left-0 w-full">
      <div className="flex items-center gap-2 ">
        <div className="rounded-full bg-base-200 size-10">
          {/* <img src="" alt="image" /> */}
        </div>

        <div className="flex flex-col">
          <p className="text-sm">{selectedUser?.fullName || "Name"}</p>
          <span className="text-xs text-base-200">offline</span>
        </div>
      </div>

      {/* <div>
        <FiMoreHorizontal />
      </div> */}
    </div>
  );
};

const Content = () => {
  return (
    <div className="bg-base-100 h-full p-2">
      <Messages />
    </div>
  );
};

const NoMessages = () => {
  return (
    <div className="flex flex-col gap-4 items-center justify-center h-full">
      <FiMessageSquare className="size-12 animate-bounce" />
      <p className="font-bold text-xl">Welcome a Chat!</p>
      <p className="text-md">Start a conversation!</p>
    </div>
  );
};

export default Home;
