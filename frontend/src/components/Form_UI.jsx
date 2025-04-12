import React from "react";

const Form_UI = () => {
  return (
    <div className="*:rounded-md *:w-full *:h-20 gap-2 grid grid-rows-3 grid-cols-3 w-70">
      {Array.from({ length: 9 }, (_, index) => (
        <div
          key={index}
          className={`${
            index % 2 === 0 ? "animate-pulse bg-accent" : "bg-base-200"
          }`}
        ></div>
      ))}
    </div>
  );
};

export default Form_UI;
