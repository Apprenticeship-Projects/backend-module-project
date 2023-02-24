import { Router } from "express";
import { auth, permissionLevel } from "../middleware/auth.js";
import Role from "../constants/roles.json" assert { type: "json" };
import { User } from "../models/index.js";

const router = Router();

// Routes for /user
router.get("/", auth, permissionLevel(Role.USER), (req, res) => {
  if (req.user) {
    const { username, email, firstName, lastName, dob, ratings, tunes } =
      req.user;
    res.status(200).send({
      username,
      email,
      firstName,
      lastName,
      dob,
      ratings: ratings.length,
      tunes: tunes.length,
    });
  } else {
    res.status(401).send("not authorized");
  }
});

router.put("/", auth, permissionLevel(Role.USER), async (req, res) => {
  if (req.user) {
    const { username, email, firstName, lastName, dob } = req.user;

    const {
      username: newUsername,
      email: newEmail,
      firstName: newFirstName,
      lastName: newLastName,
      dob: newDob,
    } = req.body;

    const updateObject = {};

    if (username !== newUsername) updateObject.username = newUsername;
    if (email !== newEmail) updateObject.email = newEmail;
    if (firstName !== newFirstName) updateObject.firstName = newFirstName;
    if (lastName !== newLastName) updateObject.lastName = newLastName;
    if (dob !== newDob) updateObject.dob = newDob;

    await User.updateOne({ _id: req.uid }, { $set: updateObject });

    const newUser = await User.findOne({ _id: req.uid });

    res.status(200).send(newUser);
  } else {
    res.status(401).send("not authorized");
  }
});

router.delete("/", auth, permissionLevel(Role.USER), async (req, res) => {
  if (req.user) {
    const dbResult = await User.deleteOne({ _id: req.uid });
    console.log(test);

    res.status(202).send("deleted");
  } else {
    res.status(401).send("not authorized");
  }
});

export { router };
