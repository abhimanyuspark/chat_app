import React from "react";

const ChatSkeleton = () => {
  return (
    <div>
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className={`chat ${i % 2 === 0 ? "chat-start" : "chat-end"}`}
        >
          <div className="chat-bubble skeleton">
            <div className="h-8 w-40 "></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatSkeleton;
