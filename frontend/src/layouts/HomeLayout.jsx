import React from "react";
import { Outlet } from "react-router";
import SideBar from "./SideBar";

const HomeLayout = () => {
  return (
    <section className="grid grid-cols-[300px_1fr]">
      <SideBar />
      <div className="adjusted-height overflow-y-auto scroll-smooth relative">
        <Outlet />
      </div>
    </section>
  );
};

export default HomeLayout;
