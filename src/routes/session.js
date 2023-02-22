import { Router } from "express";
const router = Router();

router.post("/session", (req, res) => {
  res.status(200).send("/session POST route");
});

export { router };
