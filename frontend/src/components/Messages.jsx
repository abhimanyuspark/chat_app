import React from "react";

const Messages = () => {
  return (
    <div>
      {Array.from({ length: 30 }).map((_, i) => (
        <div key={i}>
          {i % 2 ? (
            <div className="chat chat-start">
              <div className="chat-bubble bg-neutral text-neutral-content">
                It's over Anakin,
                <br />I have the high ground.
              </div>
            </div>
          ) : (
            <div className="chat chat-end">
              <div className="chat-bubble bg-primary text-primary-content">
                You underestimate my power!
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Messages;
