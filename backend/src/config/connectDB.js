const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Successfully connected to MongoDB!");
  } catch (error) {
    console.log(`Error: ${error.message}`.red.underline.bold);
  }
};

module.exports = connectDB;
