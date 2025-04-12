require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/connectDB");
const cors_options = require("./config/cors_options");

const PORT = process.env.PORT;

app.use(cors(cors_options));

app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(cookieParser());

app.use("/", require("./routes/root"));
app.use("/auth", require("./routes/auth"));
app.use("/message", require("./routes/message"));

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      message: err.message,
    },
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
  connectDB();
});
