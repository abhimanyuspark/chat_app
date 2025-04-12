const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getMessages,
  sendMessage,
} = require("../controllers/message_controller");
const protectedRoute = require("../middleware/auth_protected_route");

router.get("/users", protectedRoute, getAllUsers);
router.get("/:id", protectedRoute, getMessages);

router.post("/:id", protectedRoute, sendMessage);

module.exports = router;
