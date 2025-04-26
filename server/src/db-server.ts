require("dotenv").config();
import mongoose from "mongoose";

const dbURL = process.env.MONGO_URL as string;

const dbConnection = async () => {
  try {
    await mongoose.connect(dbURL);
    console.log("conected to db!!");
  } catch (err) {
    console.log("connection failed!!");
  }
};

export default dbConnection;
