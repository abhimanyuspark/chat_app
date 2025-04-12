import React from "react";
import NavBar from "./NavBar";
import { Outlet } from "react-router";
import useTheme from "../hooks/useTheme";

const Layout = () => {
  const { theme } = useTheme();

  return (
    <main data-theme={theme}>
      <NavBar />
      <div className="adjusted-height overflow-y-auto scroll-smooth">
        <Outlet />
      </div>
    </main>
  );
};

export default Layout;
