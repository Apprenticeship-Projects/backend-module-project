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

    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
  }

(async () => await connect())();
