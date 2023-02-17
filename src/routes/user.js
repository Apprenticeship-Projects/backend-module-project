import { Router } from "express";
const router = Router();

// Routes for /user
router.get("/", (req, res) => {
  res.status(200).send("/user GET route");
});

router.put("/", (req, res) => {
  res.status(200).send("/user PUT route");
});

router.delete("/", (req, res) => {
  res.status(202).send("/user DELETE route");
});

export { router };
