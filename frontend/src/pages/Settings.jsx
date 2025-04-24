import React from "react";
import { THEMES } from "../utils/constant";
import useTheme from "../hooks/useTheme";
import { Text } from "../components/Inputs";
import { FiPaperclip, FiSend } from "../components/Icons";

const Settings = () => {
  return (
    <div className="flex justify-center p-2">
      <div className="w-[90%] sm:w-[80%] md:w-[70%] flex gap-8 flex-col">
        <div className="flex gap-2 flex-col">
          <h4 className="font-bold text-lg">Theme</h4>
          <p className="text-base-content text-sm">
            Choose a theme for you chat interface
          </p>
        </div>

        <List />

        <div className="flex flex-col gap-4">
          <h4 className="font-bold text-lg">Preview</h4>

          <div className="bg-base-200 rounded-md p-4 flex justify-center">
            <div className="overflow-x-auto h-100 w-lg">
              <Preview />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const List = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-y-3 gap-x-1">
      {THEMES?.map((d, i) => (
        <div
          className={`${
            theme === d ? "bg-base-300" : ""
          } transition-colors flex gap-1 flex-col rounded-lg p-1.5 cursor-pointer hover:bg-base-300`}
          key={i}
          onClick={() => {
            setTheme(d);
          }}
        >
          <div
            className="grid grid-cols-4 *:h-4 *:w-full *:rounded gap-0.5 p-1 rounded"
            data-theme={d}
          >
            <div className="bg-neutral"></div>
            <div className="bg-primary"></div>
            <div className="bg-secondary"></div>
            <div className="bg-accent"></div>
          </div>
          <div className="text-center text-xs">{d}</div>
        </div>
      ))}
    </div>
  );
};

const Preview = () => {
  return (
    <div>
      <div className="flex justify-between items-center bg-base-300 py-2 px-3 rounded-md sticky z-10 top-0 left-0 w-full">
        <div className="flex items-center gap-2 ">
          <div className="rounded-full bg-base-200 size-10 text-base-content flex justify-center text-xl items-center font-bold">
            A
          </div>

          <div className="flex flex-col">
            <p className="text-sm">Anakin</p>
            <span className="text-xs text-primary">online</span>
          </div>
        </div>
      </div>
      <div className="bg-base-100 h-full p-2">
        <div className="chat chat-start">
          <div className="chat-bubble bg-neutral text-neutral-content">
            It's over Anakin,
            <br />I have the high ground.
          </div>
        </div>

        <div className="chat chat-end">
          <div className="chat-bubble bg-primary text-primary-content">
            You underestimate my power!
          </div>
        </div>

        <div className="chat chat-start">
          <div className="chat-bubble bg-neutral text-neutral-content">
            You will lose.
          </div>
        </div>

        <div className="chat chat-end">
          <div className="chat-bubble bg-primary text-primary-content">
            How?
          </div>
        </div>

        <div className="chat chat-end">
          <div className="chat-bubble bg-primary text-primary-content">
            I am Vader now!
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 left-0 h-full bg-base-300 w-full rounded-md p-2 flex gap-2 z-10 border border-base-200">
        <label className="p-3 flex justify-center items-center btn btn-soft">
          <input type="file" className="hidden" />
          <FiPaperclip />
        </label>

        <Text />

        <button className="p-3 flex justify-center items-center btn btn-accent">
          <FiSend />
        </button>
      </div>
    </div>
  );
};
export default Settings;
