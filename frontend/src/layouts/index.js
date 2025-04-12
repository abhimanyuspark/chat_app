import { lazy } from "react";

const HomeLayout = lazy(() => import("./HomeLayout"));
const Layout = lazy(() => import("./Layout"));

export { HomeLayout, Layout };
