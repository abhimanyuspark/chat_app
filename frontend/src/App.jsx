import React, { Suspense } from "react";
import { Routes, Route } from "react-router";
import {
  Home,
  LoginPage,
  NotFound,
  SignUpPage,
  Settings,
  Profile,
} from "./pages";
import { Loading, RequireAuth } from "./components";
import { Layout, HomeLayout } from "./layouts";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* start require */}
        <Route element={<RequireAuth />}>
          <Route element={<Layout />}>
            <Route element={<HomeLayout />}>
              <Route path="/" element={<Home />} />
            </Route>
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Route>
        {/* end require */}

        <Route element={<Layout />}>
          <Route path="/settings" element={<Settings />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>

      <Toaster position="top-center" reverseOrder={false} />
    </Suspense>
  );
}

export default App;
