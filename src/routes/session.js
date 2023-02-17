import { Router } from "express";
const router = Router();

// Routes for /session
router.get("/", (req, res) => {
  res.status(200).send("/session GET route");
});

router.delete("/", (req, res) => {
  res.status(200).send("/session DELETE route");
});

export { router };
