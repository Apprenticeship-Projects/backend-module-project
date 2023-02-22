import express from "express";
import { User, List } from "../../db/models";
import { COOKIE } from "../constants.js";
import validator from "express-validator";
import jsonwebtoken from "jsonwebtoken";
import auth from "../middleware/auth.js";
import errorHandler from "../middleware/errorHandler.js";

const usersRouter = express.Router();

// getting cookies
// app.get("/", async (req, res) => {
// 	// console.log(req.cookies);
// 	res.sendStatus(200);
// });

// GET USER

usersRouter.get("/", auth, (req, res) => {
	res.send(req.user);
});

// create/register user *** token

usersRouter.post(
	"/register",
	[
		//can I just test this endpoint real quick   go for it,nice works, continue! yes

		validator.body("username").notEmpty(),
		validator.body("username").isAlphanumeric(),
		// validator.body("username").notEmpty(),
		validator.body("password").isLength({ min: 8 }),
		// body('passwordConfirmation').custom((value, { req }) => {
		// 	if (value !== req.body.password) {
		// 		throw new Error('Password confirmation does not match password');
		// 	}
		// })
		errorHandler,
	],
	async (req, res) => {
		// check user doesn't already exist
		const user = await User.findOne({
			where: {
				username: req.body.username,
			},
		});
		if (user) {
			return res.status(409).send("Already created");
		}

		// create a new user
		const createdUser = await User.create({
			username: req.body.username,
			password: req.body.password,
		});

		// sign a new json web token with the user's data
		// json web tokens: https://jwt.io/
		const token = jsonwebtoken.sign(
			{
				userId: createdUser.getDataValue("id"),
				username: req.body.username,
				password: req.body.password,
			},
			process.env.TOKEN_SECRET
		);

		// add the token to the user's data
		await createdUser.update({
			token: token,
		});

		const defaultLists = await List.bulkCreate([
			{
				title: "To-do",
			},
			{
				title: "Doing",
			},
			{
				title: "Done",
			},
		]);

		await createdUser.setLists(defaultLists);

		// store the token as a cookie for the user
		res.cookie(COOKIE, token, {
			httpOnly: true,
		}).send(await User.findByPk(createdUser.getDataValue("id"))); // send the user their data
	}
);

//when the user log's in the system checks if a token is associated with any in the database.
usersRouter.post("/login", async (req, res) => {
	const data = {
		username: req.body.username,
		password: req.body.password,
	};

	const user = await User.findOne({
		attributes: {
			include: ["token"],
		},
		where: data,
	});

	//send error status incase cannot find user
	if (!user) {
		return res.sendStatus(403);
	}

	res.cookie(COOKIE, user.getDataValue("token"), {
		httpOnly: true,
	}).send(await User.findByPk(user.id));
});

usersRouter.post("/logout", auth, (req, res) => {
	res.clearCookie(COOKIE).sendStatus(200);
});

export default usersRouter;

//validation against endpoints / error messages
