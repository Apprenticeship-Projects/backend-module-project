import { Router } from "express";
const router = Router();

// Routes for /register

router.post("/", (req, res) => {
  res.status(200).send("/register POST route");
});

export { router };
