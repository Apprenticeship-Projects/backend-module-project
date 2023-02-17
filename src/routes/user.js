import { Router } from "express";
const router = Router();

router.get("/user", (req, res) => {
  res.status(200).send("/user GET route");
});

router.put("/user", (req, res) => {
  res.status(200).send("/user PUT route");
});

router.delete("/user", (req, res) => {
  res.status(200).send("/user DELETE route");
});

export { router };
