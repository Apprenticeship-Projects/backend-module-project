import dotenv from "dotenv";
dotenv.config();
import { app } from './app.js';
import { connect } from './utils/db.js';

app.listen(process.env.PORT, async () => {
    await connect();
    // await seed();
    console.log(`Listening on port ${process.env.PORT}`);
});
