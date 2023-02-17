import { Router } from "express";
import { body, validationResult } from "express-validator";
import { checkErrors } from "../utils/validationMiddleware";
import User from "../models/User.model.js";
import { createHash } from "../utils/hash";

const router = Router();

// Routes for /register

//Register user
router.post(
	"/",
	body("email").notEmpty().isEmail(),
	body("password").notEmpty().isLength({ min: 8, max: 20 }),
	body("username").notEmpty(),
	body("firstName").notEmpty(),
	body("lastName").notEmpty(),
	body("dob").notEmpty(),
	checkErrors,
	async (req, res) => {
		try {
			const hashedPass = await createHash(req.body.password);

			const createdUser = new User({
				username: req.body.username,
				firstName: req.body.firstName,
				lastName: req.body.lastName,
				password: hashedPass,
				email: req.body.email,
				dob: Date.parse(req.body.dob),
			});

			console.log(createdUser);

			await createdUser.save();

			res.status(200).send("registered");
		} catch (error) {
			console.log(error);
			res.status(400).send(error);
		}
	}
);

export { router };
