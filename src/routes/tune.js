import { Router } from "express";
const router = Router();

router.get("/tune", (req, res) => {
  res.status(200).send("/tune GET route");
});

router.get("/tune/:id", (req, res) => {
  res.status(200).send("/tune/:id GET route");
});

router.post("/tune", (req, res) => {
  res.status(200).send("/tune POST route");
});

router.put("/tune/:id", (req, res) => {
  res.status(200).send("/tune/:id PUT route");
});

router.post("/tune/:id/rate", (req, res) => {
  res.status(200).send("/tune/:id/rate POST route");
});

router.delete("/tune/:id", (req, res) => {
  res.status(200).send("/tune/:id DELETE route");
});

export { router };
