import React, { useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { Navigate, Outlet } from "react-router";
import Loading from "./Loading";

const RequireAuth = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuth();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser) {
    return <Loading />;
  } else if (authUser) {
    return <Outlet />;
  } else {
    return <Navigate to="/login" replace={true} />;
  }
};

export default RequireAuth;
