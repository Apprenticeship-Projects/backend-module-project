import dotenv from "dotenv";
dotenv.config();
import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
<<<<<<< HEAD
=======
import dotenv from "dotenv";
// import {userRouter, tuneRouter, sessionRouter} from "./routes";

dotenv.config();
>>>>>>> e36e7e0 (set up express server, listening, connected routers)

const app = express(); //create a new instance of express
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors()); //This allows post requests etc.
<<<<<<< HEAD

mongoose.set("strictQuery", false); // The default in Mongoose 7

// If it errors we want the app to fail?
await mongoose.connect(process.env.CONNECTION_STRING);
=======

// app.use('/users', userRouter);
// app.use('/tunes', tuneRouter);
// app.use('/session', sessionRouter);

async function connect() {
    try {
        mongoose.set('strictQuery', false); // The default in Mongoose 7
        await mongoose.connect(process.env.CONNECTION_STRING);
        console.log("CONNECTED");
    } catch (error) {
        console.log(error);
    }
}

app.listen(process.env.PORT, async() => {
    await connect();
    // await seed();
    console.log(`Listening on port ${process.env.PORT}`);
});


>>>>>>> e36e7e0 (set up express server, listening, connected routers)
