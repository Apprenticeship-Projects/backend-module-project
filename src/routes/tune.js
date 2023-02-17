import { Router } from "express";
const router = Router();

// Routes for /tune
router.get("/", (req, res) => {
  res.status(200).send("/tune GET route");
});

router.get("/:id", (req, res) => {
  res.status(200).send("/tune/:id GET route");
});

router.post("/", (req, res) => {
  res.status(200).send("/tune POST route");
});

router.put("/:id", (req, res) => {
  res.status(200).send("/tune/:id PUT route");
});

router.post("/:id/rate", (req, res) => {
  res.status(200).send("/tune/:id/rate POST route");
});

router.delete("/:id", (req, res) => {
  res.status(200).send("/tune/:id DELETE route");
});

export { router };
