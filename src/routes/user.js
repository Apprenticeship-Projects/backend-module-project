import { Router } from "express";
import { auth } from "../middleware/auth.js";

const router = Router();

// Routes for /user
router.get("/", auth, (req, res) => {
  console.log(req);
  res.status(200).send("/user GET route");
});

router.put("/", (req, res) => {
  res.status(200).send("/user PUT route");
});

router.delete("/", (req, res) => {
  res.status(202).send("/user DELETE route");
});

export { router };
