import { Router } from "express";
import { body } from "express-validator";
import { auth, permissionLevel } from "../middleware/auth.js";
import Role from "../constants/roles.json" assert { type: "json" };
import { User } from "../models/index.js";
import { toUTCDate } from "../utils/utc.js";

const router = Router();

router.use(auth, permissionLevel(Role.ADMIN));

// Routes for /admin
router.get("/users", (req, res) => {
  if (req.user) {
    try {
      const allUsers = User.find().exec();
      res.status(200).send(allUsers);
    } catch (error) {
      res.send(404).send(error);
    }
  } else {
    res.status(401).send("not authorized");
  }
});

router.get("/users/:id", (req, res) => {
  if (req.user) {
    try {
      const user = User.findOne({ _id: req.query.id }).exec();
      res.status(200).send(user);
    } catch (error) {
      res.send(404).send(error);
    }
  } else {
    res.status(401).send("not authorized");
  }
});

router.put(
  "/users/:id",
  body("newEmail").optional().isEmail().isLength({ min: 2, max: 32 }),
  body("newUsername")
    .optional()
    .isLength({ min: 5 })
    .not()
    .matches(/[^a-zA-Z0-9_]/),
  body("newFirstName").optional().isAlpha().isLength({ min: 1 }),
  body("newLastName").optional().isAlpha().isLength({ min: 1 }),
  body("newDob")
    .optional()
    .matches(/\d\d\d\d\/\d\d\/\d\d/),
  async (req, res) => {
    if (req.user) {
      try {
        const foundUser = await User.findOne({ _id: req.query.id }).exec(); //find the user to update

        if (!foundUser) {
          res.status(404).send("User not found");
          return;
        }

        // All update values are optional in the body, only update if they exist
        foundUser.username = req.body.newUsername
          ? req.body.newUsername
          : foundUser.username;
        foundUser.email = req.body.newEmail
          ? req.body.newEmail
          : foundUser.email;
        foundUser.firstName = req.body.newFirstName
          ? req.body.newFirstName
          : foundUser.firstName;
        foundUser.lastName = req.body.newLastName
          ? req.body.newLastName
          : foundUser.lastName;
        foundUser.dob = req.body.newDob
          ? toUTCDate(new Date(req.body.newDob))
          : dob;

        // Save the updated user and return the new object
        await foundUser.save();

        res.status(200).send({
          username: foundUser.username,
          email: foundUser.email,
          firstName: foundUser.firstName,
          lastName: foundUser.lastName,
          dob: foundUser.dob,
          ratings: foundUser.ratings.length,
          tunes: foundUser.tunes.length,
        });

        res.status(200).send(user);
      } catch (error) {
        res.send(404).send(error);
      }
    } else {
      res.status(401).send("not authorized");
    }
  }
);

router.delete("/users/:id", async (req, res) => {
  if (req.user) {
    try {
      await User.deleteOne({ _id: req.query.id }).exec();
      res.status(202).send("deleted");
    } catch (error) {
      res.send(404).send(error);
    }
  } else {
    res.status(401).send("not authorized");
  }
});

export { router };
