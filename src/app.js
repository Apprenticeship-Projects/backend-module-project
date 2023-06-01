import express from "express";
import cors from "cors";
import {
  userRouter,
  tuneRouter,
  sessionRouter,
  registerRouter,
  adminRouter,
} from "./routes/index.js";
import cookieParser from "cookie-parser";

const app = express(); //create a new instance of express
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors()); //This allows post requests etc.
app.use(cookieParser());

app.use("/user", userRouter);
app.use("/tune", tuneRouter);
app.use("/session", sessionRouter);
app.use("/register", registerRouter);
app.use("/admin", adminRouter);

export { app };
