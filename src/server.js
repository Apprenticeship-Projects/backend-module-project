import dotenv from "dotenv";
dotenv.config();
import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';

const app = express(); //create a new instance of express
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors()); //This allows post requests etc.

mongoose.set("strictQuery", false); // The default in Mongoose 7

// If it errors we want the app to fail?
await mongoose.connect(process.env.CONNECTION_STRING);
