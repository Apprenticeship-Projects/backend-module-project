import mongoose from "mongoose";

let connection;

export async function connect() {
    try {
        mongoose.set('strictQuery', false); // The default in Mongoose 7
        connection = await mongoose.connect(process.env.CONNECTION_STRING);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.log(error);
    }
}

export async function disconnect() {
    try {
        await connection.disconnect();
    } catch (error) {
        console.log(error);
    }
}
