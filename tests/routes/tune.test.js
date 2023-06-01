import request from "supertest";
import { app } from "../../src/app.js";
import { COOKIE } from "../../src/constants/cookie.js";
import seed from "../../src/data/seedFn.js";
import { Rating, User, Tune } from "../../src/models/index.js";
import { signToken } from "../../src/utils/token.js";
import setup from "../setup.js";
import teardown from "../teardown.js";

beforeAll(setup);
afterAll(teardown);

let testUser;
let testUserToken;
let testTune;
let testTune2;

beforeEach(async () => {
	await seed(false);

	testUser = await User.findOne().exec();

	if (!testUser) throw new Error("Test user not found in db");

	const sessionId = await testUser.createSession();
	testUserToken = signToken(testUser._id, sessionId);

	testTune = await Tune.findOne({ title: "Announcement" }).exec();
	testTune.owner = testUser._id;
	testUser.tunes.push(testTune._id);
	await testTune.save();
	await testUser.save();

	testTune2 = await Tune.findOne({
		title: { $not: { $eq: "Announcement" } },
	}).exec();
});

describe("GET /tune", () => {
	test("returns 200 status when logged in", async () => {
		const { statusCode } = await request(app)
			.get("/tune")
			.set("Cookie", [`${COOKIE}=${testUserToken}`]);
		expect(statusCode).toBe(200);
	});

	test("returns 401 status when not logged in", async () => {
		const { statusCode } = await request(app).get("/tune");
		expect(statusCode).toBe(401);
	});

	test("returns upto first 100 tunes", async () => {
		const { body } = await request(app)
			.get("/tune")
			.set("Cookie", [`${COOKIE}=${testUserToken}`]);

		expect(Array.isArray(body)).toBeTruthy();
		expect(body.length).toBeLessThanOrEqual(100);
	});

	test("returns only tune meta", async () => {
		const { body } = await request(app)
			.get("/tune")
			.set("Cookie", [`${COOKIE}=${testUserToken}`]);

		expect(Object.keys(body[0])).toEqual(
			expect.arrayContaining([
				"_id",
				"owner",
				"private",
				"title",
				"genre",
				"tags",
				"rating", // Rating should be calculated before being sent to client
				"bpm",
				"createdAt",
				"updatedAt",
			])
		);
	});

	test("'limit' query should change page size", async () => {
		const { body } = await request(app)
			.get("/tune")
			.query({
				limit: 3,
			})
			.set("Cookie", [`${COOKIE}=${testUserToken}`]);

		expect(body.length).toBeLessThanOrEqual(3);
	});

	test("'page' query should change page", async () => {
		const { body } = await request(app)
			.get("/tune")
			.query({
				limit: 3,
				page: 1,
			})
			.set("Cookie", [`${COOKIE}=${testUserToken}`]);

		expect(body.length).toBe(1);
	});

	test("'user' query should only return the user's tunes", async () => {
		const { body, statusCode } = await request(app)
			.get("/tune")
			.query({
				user: true,
			})
			.set("Cookie", [`${COOKIE}=${testUserToken}`]);

		expect(statusCode).toBe(200);
		expect(body.length).toBe(1);
		expect(body[0].title).toBe("Announcement");
	});
});

describe("GET /tune/:id", () => {
	test("should return all tune info for valid id", async () => {
		const { body } = await request(app)
			.get("/tune/" + testTune._id)
			.set("Cookie", [`${COOKIE}=${testUserToken}`]);

		expect(body).toBeTruthy();
		expect(Object.keys(body)).toEqual(
			expect.arrayContaining([
				"_id",
				"owner",
				"private",
				"title",
				"genre",
				"tags",
				"rating", // Rating should be calculated before being sent to client
				"bpm",
				"createdAt",
				"updatedAt",
				"tempo",
				"tracks",
			])
		);
	});

	test("should return 400 status code for an invalid id", async () => {
		const { statusCode } = await request(app)
			.get("/tune/1234")
			.set("Cookie", [`${COOKIE}=${testUserToken}`]);

		expect(statusCode).toBe(400);
	});

	test("should return 404 status code if tune does not exist", async () => {
		const { statusCode } = await request(app)
			.get("/tune/617361736461736461616161")
			.set("Cookie", [`${COOKIE}=${testUserToken}`]);

		expect(statusCode).toBe(404);
	});
});

describe("POST /tune", () => {
	test("should return the tune entry with 200 status code", async () => {
		const { body } = await request(app)
			.post("/tune")
			.set("Cookie", [`${COOKIE}=${testUserToken}`])
			.send({
				private: true,
				title: "Cool new tune",
				genre: "K_POP",
				tags: [],
				tempo: "8n",
				tracks: [
					{
						type: "SYNTH",
						notes: [
							["C3", "4n"],
							["C3", "4n"],
							["C3", "4n"],
						],
					},
				],
			});

		expect(body).toBeTruthy();
		expect(Object.keys(body)).toContain("_id");
	});

	test("should return 400 status code for bad title", async () => {
		const { statusCode } = await request(app)
			.post("/tune")
			.set("Cookie", [`${COOKIE}=${testUserToken}`])
			.send({
				private: true,
				title: "This is a tune who's title is too long and should cause a 400 error!",
				genre: "POP_ROCK",
				tags: [],
				tempo: "8n",
				tracks: [
					{
						type: "SYNTH",
						notes: [],
					},
				],
			});

		expect(statusCode).toBe(400);
	});

	test("should return 400 status code for bad genre", async () => {
		const { statusCode } = await request(app)
			.post("/tune")
			.set("Cookie", [`${COOKIE}=${testUserToken}`])
			.send({
				private: true,
				title: "Tune title",
				genre: "NOT_A_GENRE",
				tags: [],
				tempo: "8n",
				tracks: [
					{
						type: "SYNTH",
						notes: [],
					},
				],
			});

		expect(statusCode).toBe(400);
	});

	test("should return 400 status code for a bad tag", async () => {
		const { statusCode } = await request(app)
			.post("/tune")
			.set("Cookie", [`${COOKIE}=${testUserToken}`])
			.send({
				private: true,
				title: "Tune title",
				genre: "NONE",
				tags: [123],
				tempo: "8n",
				tracks: [
					{
						type: "SYNTH",
						notes: [],
					},
				],
			});

		expect(statusCode).toBe(400);
	});
});

describe("PUT /tune/:id", () => {
	test("should return 200 status code and the updated entry", async () => {
		const { body, statusCode } = await request(app)
			.put("/tune/" + testTune._id)
			.set("Cookie", [`${COOKIE}=${testUserToken}`])
			.send({
				private: true,
			});

		expect(statusCode).toBe(200);
		expect(body.private).toBeTruthy();
	});

	test("should return 400 for a bad value", async () => {
		const { statusCode } = await request(app)
			.put("/tune/" + testTune._id)
			.set("Cookie", [`${COOKIE}=${testUserToken}`])
			.send({
				title: "Hi",
			});

		expect(statusCode).toBe(400);
	});

	test("should return 400 status code for an invalid id", async () => {
		const { statusCode } = await request(app)
			.put("/tune/1234")
			.set("Cookie", [`${COOKIE}=${testUserToken}`]);

		expect(statusCode).toBe(400);
	});

	test("should return 404 status code if tune does not exist", async () => {
		const { statusCode } = await request(app)
			.put("/tune/617361736461736461616161")
			.set("Cookie", [`${COOKIE}=${testUserToken}`]);

		expect(statusCode).toBe(404);
	});
});

describe("DELETE /tune/:id", () => {
	test("should return 200 status code if successfully deleted", async () => {
		const { statusCode } = await request(app)
			.delete("/tune/" + testTune._id)
			.set("Cookie", [`${COOKIE}=${testUserToken}`]);

		expect(statusCode).toBe(200);
	});

	test("should return 400 status code for an invalid id", async () => {
		const { statusCode } = await request(app)
			.delete("/tune/1234")
			.set("Cookie", [`${COOKIE}=${testUserToken}`]);

		expect(statusCode).toBe(400);
	});

	test("should return 404 status code if tune does not exist", async () => {
		const { statusCode } = await request(app)
			.delete("/tune/617361736461736461616161")
			.set("Cookie", [`${COOKIE}=${testUserToken}`]);

		expect(statusCode).toBe(404);
	});

	test("should return 403 status code if user does not have permission to delete", async () => {
		const { statusCode } = await request(app)
			.delete("/tune/" + testTune2._id)
			.set("Cookie", [`${COOKIE}=${testUserToken}`]);

		expect(statusCode).toBe(403);
	});
});

describe("POST /tune/:id/rate", () => {
	test("should return an updated rating number", async () => {
		const { body } = await request(app)
			.post("/tune/" + testTune._id + "/rate")
			.set("Cookie", [`${COOKIE}=${testUserToken}`])
			.send({
				value: 5,
			});

		expect(body.rating).toBe(5);
	});

	test("should return an average of all ratings", async () => {
		let rating = new Rating({
			// user: testUser._id,
			tune: testTune._id,
			value: 1,
		});
		rating.save();
		testTune.ratings.push(rating);
		testTune.save();
		testUser.ratings.push(rating);
		testUser.save();

		const { body } = await request(app)
			.post("/tune/" + testTune._id + "/rate")
			.set("Cookie", [`${COOKIE}=${testUserToken}`])
			.send({
				value: 5,
			});

		expect(body.rating).toBe(3);
	});

	test("should return a 400 status code if value is invalid", async () => {
		const { statusCode } = await request(app)
			.post("/tune/" + testTune._id + "/rate")
			.set("Cookie", [`${COOKIE}=${testUserToken}`])
			.send({
				value: 0,
			});

		expect(statusCode).toBe(400);
	});
});
