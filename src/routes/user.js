import { Router } from "express";
import { body } from "express-validator";
import { auth, permissionLevel } from "../middleware/auth.js";
import Role from "../constants/roles.json" assert { type: "json" };
import { User } from "../models/index.js";
import { createHash } from "../utils/hash.js";

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

router.put("/", 
  body("newEmail").optional().isEmail().isLength({ min: 2, max: 32 }),
	body("password")
		.optional()
		.isLength({ min: 8, max: 20 })
		.not().contains(" "),
  body("newPassword")
		.optional()
		.isLength({ min: 8, max: 20 })
		.not().contains(" "),
	body("newUsername")
		.optional()
		.isLength({ min: 5 })
		.not().matches(/[^a-zA-Z0-9_]/),
	body("newFirstName").optional().isAlpha().isLength({ min: 1 }),
	body("newLastName").optional().isAlpha().isLength({ min: 1 }),
	body("newDob")
		.optional()
		.matches(/\d\d\d\d\/\d\d\/\d\d/),
  auth, 
  permissionLevel(Role.USER), 
  async (req, res) => {
    if (req.user) { //if auth has been passed, user details will be attached to the request
      const { username, email, firstName, lastName, dob } = req.user;

      const foundUser = await User.findOne({ _id: req.uid }); //find the user to update

      if(!foundUser) {
        res.status(404).send("User not found");
        return;
      }

      // All update values are optional in the body, only update if they exist
      foundUser.username = req.body.newUsername ? req.body.newUsername : username;
      foundUser.email = req.body.newEmail ? req.body.newEmail : email;
      foundUser.firstName = req.body.newFirstName ? req.body.newFirstName : firstName;
      foundUser.lastName = req.body.newLastName ? req.body.newLastName : lastName;
      foundUser.dob = req.body.newDob ? req.body.newDob : dob;

      // Special case: Only update password if user has given their old password
      if(req.body.newPassword){
        if(!req.body.password){
          res.status(401).send("not authorized");
          return;
        }else{
          const hashedPass = await createHash(req.body.password);

          if(foundUser.password !== hashedPass){
            res.status(401).send("not authorized");
            return;
          }
          
          foundUser.password = hashedPass;
        }
      }

      // Save the updated user and return the new object
      await foundUser.save();

      res.status(200).send(foundUser);
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
