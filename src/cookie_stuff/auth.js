import jsonwebtoken from "jsonwebtoken";
import { User } from "../../db/models";
import { COOKIE } from "../constants.js";

export default function auth(req, res, next) {
	const token = req.cookies[COOKIE];
	if (!token) return res.sendStatus(401);

	jsonwebtoken.verify(
		token,
		process.env.TOKEN_SECRET,
		async (error, payload) => {
			if (error) {
				return res.status(403).send(error);
			}

			const user = await User.findOne({
				where: {
					username: payload.username,
					password: payload.password,
					token: token,
				},
			});
			if (!user) {
				return res
					.clearCookie(COOKIE)
					.status(401)
					.send("Account deleted");
			}

			req.user = user;
			next();
		}
	);
}
