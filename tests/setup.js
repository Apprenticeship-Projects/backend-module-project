import dotenv from "dotenv";
import { connect } from "../src/utils/db.js";

export default async () => {
    dotenv.config({ path: ".env.test" });
    await connect();
};
