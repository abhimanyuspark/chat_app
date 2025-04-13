import React from "react";
import avatar from "../../public/pngwing.com.png";
import useAuth from "../hooks/useAuth";

const Avatar = ({ user }) => {
  const { onlineUsers } = useAuth();

  return (
    <div className="indicator rounded-full bg-base-200 border border-primary size-10 object-cover overflow-hidden">
      {onlineUsers.includes(user?._id) && (
        <span className="indicator-item status status-success"></span>
      )}
      <img
        src={user.profilePic || avatar}
        className="size-full object-cover"
        alt="avatar"
        loading="lazy"
      />
    </div>
  );
};

export default Avatar;
