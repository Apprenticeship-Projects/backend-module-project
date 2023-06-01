import { Router } from "express";
import { verifyHash } from "../utils/hash.js";
import { User } from "../models/index.js";
import {signToken, verifyToken} from "../utils/token.js";
import { body } from "express-validator";
import { checkErrors } from "../middleware/validation.js";
import {COOKIE} from "../constants/cookie.js";
import {auth} from "../middleware/auth.js";
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
		const user = await User.findOne({ username }).exec();
		if (user == null) {
			res.sendStatus(401);
			return;
		}
		if (await verifyHash(req.body.password, user.password)) {
			const sessionId = await user.createSession();
			const token = signToken(user._id, sessionId);
			res.status(200)
				.cookie(COOKIE, token, { httpOnly: true, sameSite: "strict" })
				.send();
			return;
		}
		res.sendStatus(401);
	}
);

router.delete("/", auth, checkErrors, async (req, res) => {
	if (req.user != null) {
		const token = verifyToken(req.cookies[COOKIE]);
		const removed = await req.user.removeSession(token.ses);
		if (removed) {
			res.status(200).clearCookie(COOKIE).send();
		} else {
			res.sendStatus(400);
		}
		return;
	}
	res.sendStatus(401);
});

export { router };
