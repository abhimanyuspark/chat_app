import React, { useEffect } from "react";
import useChatStore from "../hooks/useChatStore";
import { SideBarSkeleton } from "../components";

const SideBar = () => {
  return (
    <aside className="w-full h-[calc(100vh-4rem)] overflow-y-auto pt-0 p-2">
      <Content />
    </aside>
  );
};

const Content = () => {
  const { users, getUsers, isUsersLoading } = useChatStore();

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  return (
    <ul className="flex flex-col gap-2 *:py-2 *:px-3 *:text-base-content *:rounded-md">
      {isUsersLoading ? <SideBarSkeleton /> : ""}
      {users?.map((d, i) => (
        <Row user={d} key={i} />
      ))}
      {users?.length === 0 && <NotFoundRow />}
    </ul>
  );
};

const Row = ({ user }) => {
  const { selectUser } = useChatStore();

  return (
    <li
      className="flex gap-2 items-center bg-base-200"
      onClick={() => {
        selectUser(user);
      }}
    >
      <div className="rounded-full bg-base-200 size-10">
        {/* <img src="" alt="image" /> */}
      </div>

      <div className="flex flex-col">
        <p className="text-sm">{user?.fullName}</p>
        <span className="text-xs text-base-100">offline</span>
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
