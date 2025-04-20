import mongoose from "mongoose";
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
});

const contentSchema = new mongoose.Schema({
  title: String,
  link: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  tags: [String],
});

const TagSchema = new mongoose.Schema({
  _id: ObjectId,
  title: String,
});

const LinkSchema = new mongoose.Schema({
  _id: ObjectId,
  hash: String,
  userId: String,
});

export const userModel = mongoose.model("User", userSchema);
export const contentModel = mongoose.model("Content", contentSchema);
export const tagsModel = mongoose.model("tags", TagSchema);
export const linkModel = mongoose.model("links", LinkSchema);
