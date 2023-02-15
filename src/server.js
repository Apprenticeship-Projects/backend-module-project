import mongoose from "mongoose";

try {
	await mongoose.connect("mongodb://127.0.0.1:27017/backend-module-project");
	// use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
	console.log("CONNECTED");
} catch (error) {
	console.log(error);
}
