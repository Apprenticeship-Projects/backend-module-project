import mongoose from "mongoose";

const schema = new mongoose.Schema({
	username: {
		type: String,
		trim: true,
		minLength: 2,
		maxLength: 32,
		required: true,
		unique: true,
	},
	email: {
		type: String,
		trim: true,
		minLength: 5,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		minLength: 8,
		maxLength: 20,
	},
});

const User = mongoose.model("User", schema);

export default User;
