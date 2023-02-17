import { Router } from "express";
import { splitToken, verifyToken } from "../utils/token";

const router = Router();

// Routes for /user
router.get("/", (req, res) => {
  const auth = req.header("Authoization");
  const token = splitToken(auth);

  if (verifyToken(token)) {
    res.status(200).send("/user GET route");
  } else {
    res.statusCode(401);
  }
});

router.put("/", (req, res) => {
  res.status(200).send("/user PUT route");
});

router.delete("/", (req, res) => {
  res.status(202).send("/user DELETE route");
});

export { router };
