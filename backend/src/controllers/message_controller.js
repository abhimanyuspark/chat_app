const User = require("../models/User");
const Message = require("../models/Message");
const cloudinary = require("../config/cloudinary");

const getAllUsers = async (req, res) => {
  try {
    const loginedUser = req.user._id;
    const users = await User.find({ _id: { $ne: loginedUser } }).select(
      "-password"
    );
    if (!users) {
      return res.status(404).json({ message: "No users found" });
    }
    res.status(200).json(users);
  } catch (error) {
    console.error("Error during fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getMessages = async (req, res) => {
  try {
    const { id: userToChat_Id } = req.params;
    const loginedUser = req.user._id;

    const messages = await Message.find({
      $or: [
        { sender: loginedUser, receiver: userToChat_Id },
        { sender: userToChat_Id, receiver: loginedUser },
      ],
    });
    if (!messages) {
      return res.status(404).json({ message: "No messages found" });
    }

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error during fetching message:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { id: receiverId } = req.params;
    const { text, image } = req.body;
    const loginedUser = req.user._id;

    let imageURL = "";

    if (image) {
      const upload = await cloudinary.uploader.upload(image, {
        upload_preset: "practice",
        folder: "chat_app",
      });
      if (!upload) {
        return res.status(500).json({ message: "Error uploading image" });
      }

      imageURL = upload.secure_url;
    }

    const newMessage = await Message.create({
      sender: loginedUser,
      receiverId,
      text,
      image: imageURL,
    });

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error during sending messages:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getAllUsers, getMessages, sendMessage };
