import dotenv from "dotenv";
import { connect } from "../src/utils/db.js";
import seed from "../src/data/seedFn.js";

export default async () => {
	dotenv.config({ path: ".env.test" });
	await seed();
	await connect();
};
