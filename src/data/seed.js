import bcrypt from "bcrypt";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import users from "./users.json" assert { type: "json" };
import tunes from "./tunes.json" assert { type: "json" };
import { User, Tune } from "../models/index.js";

const SALT_ROUNDS = 10;

mongoose.set("strictQuery", false); // The default in Mongoose 7
await mongoose.connect(process.env.CONNECTION_STRING);

async function seed() {
	await User.deleteMany({});
	await Tune.deleteMany({});

	for (let user of users) {
		user.password = await bcrypt.hash(user.password, SALT_ROUNDS);
	}

	await User.insertMany(users);
	await Tune.insertMany(tunes);

	await mongoose.disconnect();
}

seed();
