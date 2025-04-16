require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/connectDB");
const cors_options = require("./config/cors_options");
const { app, server } = require("./config/socket");

const PORT = process.env.PORT;
const __dirname = path.resolve();

app.use(cors(cors_options));

app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));

app.use(cookieParser());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/message", require("./routes/message"));

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

server.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
  connectDB();
});
