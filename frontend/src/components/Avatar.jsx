import React from "react";
import avatar from "../../public/pngwing.com.png";
import useAuth from "../hooks/useAuth";

const Avatar = ({ user }) => {
  const { onlineUsers } = useAuth();

  return (
    <div
      className={`avatar ${
        onlineUsers.includes(user?._id) ? "avatar-online" : "avatar-offline"
      }`}
    >
      <div className="w-10 rounded-full">
        <img
          src={user.profilePic || avatar}
          className="size-full object-cover"
          alt="avatar"
          loading="lazy"
        />
      </div>
    </div>
  );
};

export default Avatar;
