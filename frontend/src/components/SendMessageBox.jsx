import React, { useState } from "react";
import { Text } from "./Inputs";
import { FiSend, FiPaperclip } from "./Icons";

const SendMessageBox = () => {
  const [formData, setFormData] = useState({
    text: "",
    image: "",
  });
  const [imageLoad, setImageLoad] = useState(false);

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
    alert("Form Submitted :  " + JSON.stringify(formData, null, 2));
  };

  return (
    <form
      onSubmit={onSubmit}
      className="sticky bottom-0 left-0 h-full bg-base-300 w-full rounded-md p-2 flex gap-2 z-10 border border-base-200"
    >
      <label className="p-3 flex justify-center items-center btn btn-soft">
        <input type="file" className="hidden" onChange={handleImageChange} />
        <FiPaperclip />
      </label>

      <Text onChange={onChange} name="text" />

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
