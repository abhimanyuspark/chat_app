import React from "react";

const Loading = () => {
  return (
    <div className="flex justify-center items-center absolute top-0 left-0 z-50 size-full bg-[rgba(0,0,0,0.3)]">
      <span className="loading loading-spinner loading-xl text-success"></span>
    </div>
  );
};

export default Loading;
