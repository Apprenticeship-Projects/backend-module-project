import dotenv from "dotenv";
dotenv.config();
import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import {userRouter, tuneRouter, sessionRouter, registerRouter} from './routes/index.js';

const app = express(); //create a new instance of express
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors()); //This allows post requests etc.

app.use('/user', userRouter);
app.use('/tune', tuneRouter);
app.use('/session', sessionRouter);
app.use('/register', registerRouter);

async function connect() {
    try {
        mongoose.set('strictQuery', false); // The default in Mongoose 7
        await mongoose.connect(process.env.CONNECTION_STRING);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.log(error);
    }
}

app.listen(process.env.PORT, async() => {
    await connect();
    // await seed();
    console.log(`Listening on port ${process.env.PORT}`);
});


