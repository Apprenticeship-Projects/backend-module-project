import { Router } from "express";
const router = Router();

router.get("/tune", (req, res) => {
  res.sendStatus(200);
});

router.get("/tune/:id", (req, res) => {
  res.sendStatus(200);
});

router.post("/tune", (req, res) => {
  res.sendStatus(200);
});

router.put("/tune/:id", (req, res) => {
  res.sendStatus(200);
});

router.post("/tune/:id/rate", (req, res) => {
  res.sendStatus(200);
});

router.delete("/tune/:id", (req, res) => {
  res.sendStatus(200);
});

export { router };
