import { Router } from "express";
const router = Router();

// Routes for /session
router.get("/session", (req, res) => {
  res.status(200).send("/session GET route");
});

router.post("/session", (req, res) => {
  res.status(200).send("/session POST route");
});

router.delete("/session", (req, res) => {
  res.status(200).send("/session DELETE route");
});

export { router };
