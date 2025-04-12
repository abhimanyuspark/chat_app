const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protectedRoute = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No Token Provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }

    const user = await User.findOne({ _id: decoded.userId })
      .select("-password")
      .exec();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;

    next();
  } catch (error) {
    console.error("Error in protected route middleware:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = protectedRoute;
