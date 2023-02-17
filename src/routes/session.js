import { Router } from "express";
const router = Router();

router.get("/session", (req, res) => {
  res.sendStatus(200);
});

router.post("/session", (req, res) => {
  res.sendStatus(200);
});

router.delete("/session", (req, res) => {
  res.sendStatus(200);
});

export { router };
