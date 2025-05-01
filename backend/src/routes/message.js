const express = require("express");
const router = express.Router();
const protectedRoute = require("../middleware/auth_protected_route");
const {
  getAllUsers,
  getMessages,
  sendMessage,
  deleteMessagesForMe,
  deleteMessagesForEveryone,
  editMessage,
} = require("../controllers/message_controller");

router.get("/users", protectedRoute, getAllUsers);
router.get("/:id", protectedRoute, getMessages);
router.post("/send/:id", protectedRoute, sendMessage);
router.put("/delete-for-me", protectedRoute, deleteMessagesForMe);
router.put("/delete-for-everyone", protectedRoute, deleteMessagesForEveryone);
router.put("/edit-message", protectedRoute, editMessage);

module.exports = router;
