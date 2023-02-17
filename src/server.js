import {app} from './app.js';
import mongoose from 'mongoose';

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


