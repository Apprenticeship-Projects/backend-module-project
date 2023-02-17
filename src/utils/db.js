import mongoose from "mongoose";

let connected = false;

export async function connect() {
	if (connected) return;

	try {
		mongoose.set("strictQuery", false); // The default in Mongoose 7
		await mongoose.connect(process.env.CONNECTION_STRING);
		connected = true;
		console.log("Connected to MongoDB");
	} catch (error) {
		console.log(error);
	}
}

export async function disconnect() {
	if (!connected) return;
	try {
		await mongoose.disconnect();
		connected = false;
	} catch (error) {
		console.log(error);
	}
}
