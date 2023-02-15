import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

async function connect() {
    try {
        await mongoose.connect(process.env.CONNECTION_STRING);
        console.log("CONNECTED");
    } catch (error) {
        console.log(error);
    }
}

(async () => await connect())();
