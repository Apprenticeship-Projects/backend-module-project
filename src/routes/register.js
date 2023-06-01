import { Router } from "express";
import { body, validationResult } from "express-validator";
import { checkErrors } from "../middleware/validation.js";
import User from "../models/User.model.js";
import { createHash } from "../utils/hash.js";
import { toUTCDate } from "../utils/utc.js";

const router = Router();

// Routes for /register

//Register user
router.post(
	"/",
	body("email").notEmpty().isEmail().isLength({ min: 2, max: 32 }),
	body("password")
		.notEmpty()
		.isLength({ min: 8, max: 20 })
		.not().contains(" "),
	body("username")
		.notEmpty()
		.isLength({ min: 5 })
		.not().matches(/[^a-zA-Z0-9_]/),
	body("firstName").notEmpty().isAlpha().isLength({ min: 1 }),
	body("lastName").notEmpty().isAlpha().isLength({ min: 1 }),
	body("dob")
		.notEmpty()
		.matches(/\d\d\d\d\/\d\d\/\d\d/),
	checkErrors,
	async (req, res) => {
		try {
			const hashedPass = await createHash(req.body.password);

			const createdUser = await User.create({
				username: req.body.username,
				firstName: req.body.firstName,
				lastName: req.body.lastName,
				password: hashedPass,
				email: req.body.email,
				dob: toUTCDate(new Date(req.body.dob)),
			});

			res.send("registered");
		} catch (error) {
			res.status(400).send(error);
		}
	}
);

export { router };
