import React from "react";

const SideBarSkeleton = () => {
  return (
    <>
      {Array.from({ length: 8 }).map((_, i) => (
        <li className="w-full" key={i}>
          <div className="flex items-center gap-4">
            <div className="skeleton h-10 w-10 shrink-0 rounded-full"></div>
            <div className="flex flex-col gap-4 w-full">
              <div className="skeleton h-2 w-full"></div>
              <div className="skeleton h-2 w-full"></div>
            </div>
          </div>
        </li>
      ))}
    </>
  );
};

export default SideBarSkeleton;
