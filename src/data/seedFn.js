import bcrypt from "bcrypt";
import users from "./users.json" assert { type: "json" };
import tunes from "./tunes.json" assert { type: "json" };
import { User, Tune } from "../models/index.js";
import { connect, disconnect } from "../utils/db.js";
import {} from "mongoose";
import { toUTCDate } from "../utils/utc.js";

const SALT_ROUNDS = 10;

export default async function seed(close = true) {
	await connect();

	await User.deleteMany({});
	await Tune.deleteMany({});

	for (let user of users) {
		user.password = await bcrypt.hash(user.password, SALT_ROUNDS);
		user.dob = toUTCDate(new Date(user.dob));
	}

	await User.insertMany(users);
	await Tune.insertMany(tunes);

	if (close) await disconnect();
}
