const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getMessages,
  sendMessage,
  clearChat,
} = require("../controllers/message_controller");
const protectedRoute = require("../middleware/auth_protected_route");

router.get("/users", protectedRoute, getAllUsers);
router.get("/:id", protectedRoute, getMessages);

router.post("/send/:id", protectedRoute, sendMessage);

router.delete("/clear-chat/:id", protectedRoute, clearChat);

module.exports = router;
