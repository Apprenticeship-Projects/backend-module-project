import { disconnect } from "../src/utils/db.js";

export default async () => {
    await disconnect();
};
