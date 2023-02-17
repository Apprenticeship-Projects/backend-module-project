import { Router } from "express";
const router = Router();

router.get("/user", (req, res) => {
  res.sendStatus(200);
});

router.put("/user", (req, res) => {
  res.sendStatus(200);
});

router.delete("/user", (req, res) => {
  res.sendStatus(200);
});

export { router };
