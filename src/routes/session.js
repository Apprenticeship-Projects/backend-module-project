import { Router } from "express";
import { verifyHash } from "../utils/hash.js";
import { User } from "../models/index.js";
import { signToken } from "../utils/token.js";
import newID from "../utils/snowflake.js";
import { body } from "express-validator";
import { checkErrors } from "../middleware/validation.js";
const router = Router();

router.post(
	"/",
	body("username")
		.notEmpty()
		.isLength({ min: 5 })
		.not()
		.matches(/[^a-zA-Z0-9_]/),
	body("password")
		.notEmpty()
		.isLength({ min: 8, max: 20 })
		.not()
		.contains(" "),
	checkErrors,
	async (req, res) => {
		const username = req.body.username;
		const user = await User.findOne({ username });
		if (user == null) {
			res.sendStatus(403);
			return;
		}
		if (await verifyHash(req.body.password, user.password)) {
			const sessionId = await user.createSession();
			const token = signToken(user._id, sessionId);
			res.status(200)
				.cookie("token", token, { httpOnly: true, sameSite: "strict" })
				.send();
			return;
		}
		res.sendStatus(403);
	}
);

export { router };
