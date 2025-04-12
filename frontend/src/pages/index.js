import { lazy } from "react";

const Home = lazy(() => import("./Home"));
const LoginPage = lazy(() => import("./LoginPage"));
const SignUpPage = lazy(() => import("./SignUpPage"));
const Settings = lazy(() => import("./Settings"));
const Profile = lazy(() => import("./Profile"));
const NotFound = lazy(() => import("./NotFound"));

export { Home, LoginPage, SignUpPage, NotFound, Profile, Settings };
