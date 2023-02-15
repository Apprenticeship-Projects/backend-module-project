import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import dotenv from "dotenv";
dotenv.config();

const app = express(); //create a new instance of express
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors()); //This allows post requests etc.
async function connect() {
    try {
        mongoose.set('strictQuery', false); // The default in Mongoose 7
        await mongoose.connect(process.env.CONNECTION_STRING);
        console.log("CONNECTED");
    } catch (error) {
        console.log(error);
    }
}

await connect();
