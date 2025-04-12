import React from "react";
import { Link, useNavigate } from "react-router";
import useAuth from "../hooks/useAuth";
import { FiMessageSquare, FiSettings } from "../components/Icons";
import toast from "react-hot-toast";

const NavBar = () => {
  const { isLoggingOut, logOut, authUser } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="navbar bg-base-200">
      <div className="flex-1">
        <Link to="/" className="text-xl btn btn-ghost">
          <FiMessageSquare /> chatApp
        </Link>
      </div>

      <div>
        {authUser ? (
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img
                  alt="Tailwind CSS Navbar component"
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-300 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              <li>
                <Link to="/profile" className="justify-between">
                  Profile
                  <span className="badge">New</span>
                </Link>
              </li>
              <li>
                <Link to="/settings">Settings</Link>
              </li>
              <li
                onClick={async () => {
                  toast.promise(
                    logOut().then((res) => {
                      if (res.status === 200) {
                        navigate("/login");
                      } else {
                        console.error(res);
                      }
                    }),
                    {
                      loading: "Logging Out...",
                      success: "Logout successfully",
                      error: (error) => {
                        return error;
                      },
                    }
                  );
                }}
              >
                <a>{isLoggingOut ? "Logging out..." : "Logout"}</a>
              </li>
            </ul>
          </div>
        ) : (
          <div className="btn btn-ghost btn-circle avatar">
            <Link to="/settings">
              <FiSettings />
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
