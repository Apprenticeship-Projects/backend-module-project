import { Router } from "express";
import { body, param, query } from "express-validator";
import mongoose, { isValidObjectId } from "mongoose";
import { auth, permissionLevel } from "../middleware/auth.js";
import { checkErrors } from "../middleware/validation.js";
import Role from "../constants/roles.json" assert { type: "json" };
import GENRES from "../constants/genres.json" assert { type: "json" };
import { Tune, Rating } from "../models/index.js";
import escapeStringRegexp from "escape-string-regexp";

const router = Router();

router.use(auth, permissionLevel(Role.USER));

function calculateAverageRating(ratings) {
	let avgRating = 0;
	for (let rating of ratings) {
		avgRating += rating.value;
	}
	avgRating /= ratings.length;
	return avgRating;
}

function sanitizeTune(tune, metaOnly = false) {
	const result = {
		_id: tune._id,
		owner: {
			_id: tune.owner?._id,
			username: tune.owner?.username,
		},
		private: tune.private,
		title: tune.title,
		genre: tune.genre,
		tags: tune.tags,
		rating: calculateAverageRating(tune.ratings),
		bpm: tune.bpm,
		createdAt: tune.createdAt,
		updatedAt: tune.updatedAt,
	};

	if (!metaOnly) {
		result.tempo = tune.tempo;
		result.tracks = tune.tracks;
	}

	return result;
}

// Routes for /tune
router.get(
	"/",
	query("limit")
		.optional()
		.isInt({
			min: 1,
		})
		.toInt(),
	query("page")
		.optional()
		.isInt({
			min: 0,
		})
		.toInt(),
	query("user").optional().isBoolean().toBoolean(),
	query("genres").optional().isArray().toArray(),
	query("genres.*")
		.isString()
		.customSanitizer((value) => {
			if (typeof value !== "string") return value;
			return value.toUpperCase().replace("&", "").replace(/\s+/g, "_");
		})
		.custom((value) => {
			if (!GENRES.includes(value)) {
				throw new Error(`${value} is not a valid genre`);
			}
			return true;
		}),
	query("tags").optional().isArray().toArray(),
	query("tags.*")
		.isString()
		.customSanitizer((value) => {
			if (typeof value !== "string") return value;
			return value.toUpperCase().replace("&", "").replace(/\s+/g, "_");
		}),
	query("q").optional().isLength({
		min: 1,
	}),
	checkErrors,
	async (req, res) => {
		let limit = req.query.limit ?? 100;
		let page = req.query.page ?? 0;

		let tunesQuery = Tune.find();

		if (req.query.user) {
			tunesQuery.where("owner").equals(req.user._id);
		} else if (req.user.role < Role.ADMIN) {
			tunesQuery.where("private").equals(false);
		}

		if (req.query.q) {
			tunesQuery
				.where("title")
				.regex(new RegExp(escapeStringRegexp(req.query.q), "i"));
		}

		if (req.query.genres) {
			tunesQuery.where("genre").in(req.query.genres);
		}

		if (req.query.tags) {
			tunesQuery.where("tags").all(req.query.tags);
		}

		let tunesFromSearch = await tunesQuery
			.skip(limit * page)
			.limit(limit)
			.exec();

		if (tunesFromSearch == null || tunesFromSearch.length == 0) {
			return res.status(404).send("No tunes found");
		}

		let resultTunes = [];
		for (const tune of tunesFromSearch) {
			resultTunes.push(sanitizeTune(tune, true));
		}

		res.send(resultTunes);
	}
);

router.get(
	"/:id",
	param("id").custom((value) => {
		// https://stackoverflow.com/a/29231016 > https://stackoverflow.com/a/61779949
		if (!isValidObjectId(value)) {
			throw new Error(`${value} is not a valid id`);
		}
		return true;
	}),
	checkErrors,
	async (req, res) => {
		const tune = await Tune.findById(req.params.id)
			.populate("owner")
			.populate("ratings")
			.exec();

		if (!tune) {
			return res.sendStatus(404);
		}

		if (
			tune.private &&
			!tune.owner?._id.equals(req.user._id) &&
			req.user.role < Role.ADMIN
		) {
			return res.sendStatus(403);
		}

		res.send(sanitizeTune(tune));
	}
);

router.post(
	"/",
	body("private").optional().isBoolean(),
	body("title").isLength({
		min: 5,
		max: 64,
	}),
	body("genre")
		.optional()
		.isString()
		.customSanitizer((value) => {
			if (typeof value !== "string") return value;
			return value.toUpperCase().replace("&", "").replace(/\s+/g, "_");
		})
		.isIn(GENRES),
	body("tags").optional().isArray(),
	body("tags.*")
		.isString()
		.customSanitizer((value) => {
			if (typeof value !== "string") return value;
			return value.toUpperCase().replace("&", "").replace(/\s+/g, "_");
		}),
	body("bpm").optional().isInt({
		min: 1,
	}),
	body("tempo").optional().isString(),
	body("tracks").isArray(),
	body("tracks.*").isObject(),
	body("tracks.*.type").isString().toUpperCase(),
	body("tracks.*.notes").isArray(),
	body("tracks.*.notes.*").isArray({
		min: 2,
		max: 2,
	}),
	body("tracks.*.notes.*.*").isString(),
	checkErrors,
	async (req, res) => {
		const data = req.body;

		const tune = new Tune({
			owner: req.user._id,
			private: data.private ?? true,
			title: data.title,
			genre: data.genre,
			tags: data.tags,
			bpm: data.bpm,
			tempo: data.tempo,
			tracks: data.tracks,
		});

		await tune.save();

		res.send(sanitizeTune(tune));
	}
);

router.put(
	"/:id",
	param("id").custom((value) => {
		// https://stackoverflow.com/a/29231016 > https://stackoverflow.com/a/61779949
		if (!isValidObjectId(value)) {
			throw new Error(`${value} is not a valid id`);
		}
		return true;
	}),
	body("private").optional().isBoolean(),
	body("title").optional().isLength({
		min: 5,
		max: 64,
	}),
	body("genre")
		.optional()
		.isString()
		.customSanitizer((value) => {
			if (typeof value !== "string") return value;
			return value.toUpperCase().replace("&", "").replace(/\s+/g, "_");
		})
		.isIn(GENRES),
	body("tags").optional().isArray(),
	body("tags.*")
		.isString()
		.customSanitizer((value) => {
			if (typeof value !== "string") return value;
			return value.toUpperCase().replace("&", "").replace(/\s+/g, "_");
		}),
	body("bpm").optional().isInt({
		min: 1,
	}),
	body("tempo").optional().isString(),
	body("tracks").optional().isArray(),
	body("tracks.*").isObject(),
	body("tracks.*.type").isString().toUpperCase(),
	body("tracks.*.notes").isArray(),
	body("tracks.*.notes.*").isArray({
		min: 2,
		max: 2,
	}),
	body("tracks.*.notes.*.*").isString(),
	checkErrors,
	async (req, res) => {
		const tune = await Tune.findById(req.params.id)
			.populate("owner")
			.exec();

		if (!tune) {
			return res.sendStatus(404);
		}

		if (
			!tune.owner?._id.equals(req.user._id) &&
			req.user.role < Role.ADMIN
		) {
			return res.sendStatus(403);
		}

		const data = req.body;

		tune.private = data.private ?? tune.private;
		tune.title = data.title ?? tune.title;
		tune.genre = data.genre ?? tune.genre;
		tune.tags = data.tags ?? tune.tags;
		tune.bpm = data.bpm ?? tune.bpm;
		tune.tempo = data.tempo ?? tune.tempo;
		tune.tracks = data.tracks ?? tune.tracks;

		await tune.save();

		res.send(sanitizeTune(tune));
	}
);

router.post(
	"/:id/rate",
	param("id").custom((value) => {
		// https://stackoverflow.com/a/29231016 > https://stackoverflow.com/a/61779949
		if (!isValidObjectId(value)) {
			throw new Error(`${value} is not a valid id`);
		}
		return true;
	}),
	body("value").isInt({
		min: 1,
		max: 5,
	}),
	checkErrors,
	async (req, res) => {
		const tune = await Tune.findById(req.params.id)
			.populate("owner")
			.populate("ratings")
			.exec();

		if (!tune) {
			return res.sendStatus(404);
		}

		if (tune.private) {
			return res.sendStatus(403);
		}

		let existingRating;
		for (const rating of tune.ratings) {
			if (rating.user?._id.equals(req.user._id)) {
				existingRating = rating;
				break;
			}
		}

		if (!existingRating) {
			existingRating = new Rating({
				user: req.user._id,
				tune: tune._id,
			});

			tune.ratings.push(existingRating._id);
		}

		// const ratingToUpdate = await Rating.findById(existingRating._id)

		existingRating.value = req.body.value;
		await existingRating.save();

		await tune.save();

		const updatedTune = await tune.populate("ratings");

		res.send({
			rating: calculateAverageRating(updatedTune.ratings),
		});
	}
);

router.delete(
	"/:id",
	param("id").custom((value) => {
		// https://stackoverflow.com/a/29231016 > https://stackoverflow.com/a/61779949
		if (!isValidObjectId(value)) {
			throw new Error(`${value} is not a valid id`);
		}
		return true;
	}),
	checkErrors,
	async (req, res) => {
		const tune = await Tune.findById(req.params.id)
			.populate("owner")
			.exec();

		if (!tune) {
			return res.sendStatus(404);
		}

		if (
			!tune.owner?._id.equals(req.user._id) &&
			req.user.role < Role.ADMIN
		) {
			return res.sendStatus(403);
		}

		if (tune.owner) {
			tune.owner.tunes = tune.owner.tunes.filter(
				(id) => !id.equals(tune._id)
			);
			await tune.owner.save();
		}

		await tune.delete();
		res.sendStatus(200);
	}
);

export { router };
