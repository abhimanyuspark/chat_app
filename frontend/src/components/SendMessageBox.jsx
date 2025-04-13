import React, { useState } from "react";
import { Text } from "./Inputs";
import { FiSend, FiPaperclip, FiXCircle } from "./Icons";
import useChatStore from "../hooks/useChatStore";
import toast from "react-hot-toast";

const SendMessageBox = () => {
  const [formData, setFormData] = useState({
    text: "",
    image: "",
  });
  const [imageLoad, setImageLoad] = useState(false);
  const { sendMessage } = useChatStore();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.readAsDataURL(file); // convert to base64 string
      reader.onloadstart = () => setImageLoad(true);
      reader.onloadend = () => {
        setImageLoad(false);
        setFormData((p) => ({ ...p, image: reader.result }));
      };
    }
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const { text, image } = formData;

    if (!text && !image) {
      return toast.error("Please type a message or select an image to chat");
    }

    sendMessage(formData);
    setFormData({ text: "", image: "" });
  };

  return (
    <form
      onSubmit={onSubmit}
      className="bottom-0 left-0 h-auto bg-base-300 w-full rounded-md p-2 flex gap-2 z-10 border border-base-200"
    >
      <div className="relative">
        {formData?.image && (
          <>
            <div className="size-40 rounded overflow-hidden absolute -top-44 left-0">
              {imageLoad ? (
                <div className="size-full skeleton"></div>
              ) : (
                <img
                  src={formData?.image}
                  alt="image"
                  className="size-full object-cover"
                />
              )}
            </div>
            <button
              type="reset"
              className="absolute -top-44 left-38 bg-base-300 rounded-full hover:bg-accent cursor-pointer"
              onClick={() => {
                setFormData((p) => ({ ...p, image: "" }));
              }}
            >
              <FiXCircle className="size-6" />
            </button>
          </>
        )}
      </div>

      <label className="p-3 flex justify-center items-center btn btn-soft">
        <input type="file" className="hidden" onChange={handleImageChange} />
        <FiPaperclip />
      </label>

      <Text onChange={onChange} name="text" value={formData.text} />

      <button
        type="submit"
        className="p-3 flex justify-center items-center btn btn-accent"
      >
        <FiSend />
      </button>
    </form>
  );
};

export default SendMessageBox;
