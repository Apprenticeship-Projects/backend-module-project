import { Router } from "express";
import { splitToken, verifyToken } from "../utils/token.js";

const router = Router();

// Routes for /user
router.get("/", (req, res) => {
  // !req.user
  res.status(200).send("/user GET route");
});

router.put("/", (req, res) => {
  res.status(200).send("/user PUT route");
});

router.delete("/", (req, res) => {
  res.status(202).send("/user DELETE route");
});

export { router };
