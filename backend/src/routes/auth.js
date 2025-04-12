const express = require("express");
const router = express.Router();
const {
  signUp,
  logIn,
  logOut,
  updateProfile,
  checkAuth,
} = require("../controllers/auth_controller");
const protectedRoute = require("../middleware/auth_protected_route");

router.post("/signup", signUp);
router.post("/login", logIn);
router.post("/logout", logOut);

router.post("/profile", protectedRoute, updateProfile);
router.get("/check", protectedRoute, checkAuth);

module.exports = router;
