import mongoose from "mongoose";

const schema = new mongoose.Schema({});

const User = mongoose.model("User", schema);

export default User;
