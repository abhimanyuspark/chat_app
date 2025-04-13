import React from "react";
import { Messages } from "../components";
import { FiMessageSquare } from "../components/Icons";
import useChatStore from "../hooks/useChatStore";

const Home = () => {
  const { selectedUser } = useChatStore();

  return <>{selectedUser ? <Messages /> : <NoMessages />}</>;
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
