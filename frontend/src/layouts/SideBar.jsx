import React, { useEffect } from "react";
import useChatStore from "../hooks/useChatStore";
import { Avatar, SideBarSkeleton } from "../components";
import useAuth from "../hooks/useAuth";
import { FiUser } from "../components/Icons";

const SideBar = () => {
  return (
    <aside className="w-full h-[calc(100vh-4rem)] overflow-y-auto pr-1 bg-base-200">
      <Header />
      <Content />
    </aside>
  );
};

const Header = () => {
  return (
    <div className="sticky top-0 left-0 w-full h-14 flex items-center gap-4 px-6 border border-base-300 z-50 bg-base-200">
      <FiUser />
      <p className="font-bold">Contacts</p>
    </div>
  );
};

const Content = () => {
  const { users, getUsers, isUsersLoading } = useChatStore();

  useEffect(() => {
    if (users?.length === 0) getUsers();
  }, [getUsers, users]);

  return (
    <ul className="flex flex-col gap-1 *:py-2 *:px-3 *:text-base-content">
      {isUsersLoading ? <SideBarSkeleton /> : ""}
      {users?.map((d, i) => (
        <Row user={d} key={i} />
      ))}
      {isUsersLoading ? "" : users?.length === 0 && <NotFoundRow />}
    </ul>
  );
};

const Row = ({ user }) => {
  const { selectUser, selectedUser } = useChatStore();
  const { onlineUsers } = useAuth();

  return (
    <li
      className={`${
        selectedUser?._id === user?._id ? "bg-base-300" : ""
      } flex gap-2 items-center hover:bg-base-300 cursor-pointer transition-colors`}
      onClick={() => {
        selectUser(user);
      }}
    >
      <Avatar user={user} />

      <div className="flex flex-col">
        <p className="text-sm">{user?.fullName}</p>
        <span className="text-xs">
          {onlineUsers.includes(user?._id) ? (
            <span className="text-primary">online</span>
          ) : (
            <span className="text-gray-500">offline</span>
          )}
        </span>
      </div>
    </li>
  );
};

const NotFoundRow = () => {
  return (
    <li className="flex gap-2 items-center justify-center text-sm my-5">
      No User Found
    </li>
  );
};

export default SideBar;
