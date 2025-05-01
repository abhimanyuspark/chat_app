const User = require("../models/User");
const Message = require("../models/Message");
const cloudinary = require("../config/cloudinary");
const { io, getRecieverSocketId } = require("../config/socket");

const getAllUsers = async (req, res) => {
  try {
    const loginedUser = req.user._id;
    const users = await User.find({ _id: { $ne: loginedUser } }).select(
      "-password"
    );
    if (!users) return res.status(404).json({ message: "No users found" });
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getMessages = async (req, res) => {
  try {
    const { id: userToChat_Id } = req.params;
    const loginedUser = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: loginedUser, receiverId: userToChat_Id },
        { senderId: userToChat_Id, receiverId: loginedUser },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
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
      if (!upload)
        return res.status(500).json({ message: "Image upload failed" });
      imageURL = upload.secure_url;
    }

    const newMessage = await Message.create({
      senderId: loginedUser,
      receiverId,
      text,
      image: imageURL,
    });

    const receiverSocketId = getRecieverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteMessagesForMe = async (req, res) => {
  try {
    const { messageIds } = req.body;
    const userId = req.user._id;

    await Message.updateMany(
      { _id: { $in: messageIds } },
      { $addToSet: { deletedFor: userId } }
    );

    res.status(200).json({ message: "Messages deleted for you" });
  } catch (error) {
    console.error("Delete for me error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteMessagesForEveryone = async (req, res) => {
  try {
    const { messageIds } = req.body;
    // const userId = req.user._id;

    await Message.updateMany(
      { _id: { $in: messageIds } },
      { $set: { text: "[Deleted]", image: "", deletedForEveryone: true } }
    );

    res.status(200).json({ message: "Messages deleted for everyone" });
  } catch (error) {
    console.error("Delete for everyone error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const editMessage = async (req, res) => {
  try {
    const { messageId, newText } = req.body;
    const userId = req.user._id;

    const message = await Message.findById(messageId);
    if (!message) return res.status(404).json({ message: "Message not found" });
    if (message.senderId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    message.text = newText;
    message.isEdited = true;
    await message.save();

    res.status(200).json({ message: "Message edited", data: message });
  } catch (error) {
    console.error("Edit message error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getAllUsers,
  getMessages,
  sendMessage,
  deleteMessagesForMe,
  deleteMessagesForEveryone,
  editMessage,
};
