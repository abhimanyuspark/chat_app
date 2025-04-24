import React from "react";
import { Outlet } from "react-router";
import SideBar from "./SideBar";
import useChatStore from "../hooks/useChatStore";

const HomeLayout = () => {
  const { selectedUser } = useChatStore();

  return (
    <section
      className={`grid sm:grid-cols-[300px_1fr] ${
        selectedUser ? "grid-cols-[0px_1fr]" : "grid-cols-[1fr_0px]"
      }`}
    >
      <SideBar />
      <div className="adjusted-height overflow-y-auto scroll-smooth relative">
        <Outlet />
      </div>
    </section>
  );
};

export default HomeLayout;
