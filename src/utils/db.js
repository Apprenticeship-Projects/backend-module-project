import mongoose from "mongoose";

export async function connect() {
	try {
		mongoose.set("strictQuery", false); // The default in Mongoose 7
		await mongoose.connect(process.env.CONNECTION_STRING);
		console.log("Connected to MongoDB");
	} catch (error) {
		console.log(error);
	}
}

export async function disconnect() {
	try {
		await mongoose.disconnect();
	} catch (error) {
		console.log(error);
	}
}
