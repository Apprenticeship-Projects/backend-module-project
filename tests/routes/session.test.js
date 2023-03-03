import { app } from "../../src/app.js";
import request from "supertest";
import setup from "../setup.js";
import teardown from "../teardown.js";
import {User} from "../../src/models/index.js";
import {signToken} from "../../src/utils/token.js";
import {COOKIE} from "../../src/constants/cookie.js";

beforeAll(setup);
afterAll(teardown);

const wrongToken = signToken("test", "test");
let testUserObject, testUserToken;
beforeEach(async () => {
	testUserObject = {
		username: "theFlash1",
		email: "flash@email.com",
		firstName: "Henry",
		lastName: "Allen",
		dob: new Date("1992-09-30").toISOString(),
		ratings: 0,
		tunes: 0
	};
	const user = await User.findOne({ username: testUserObject.username }).exec();
	const sessionId = await user.createSession();
	testUserToken = signToken(user._id, sessionId);
});

describe("New session", () => {
	test("Valid user", async () => {
		const { statusCode, headers } = await request(app)
			.post("/session")
			.send({
				username: "theFlash1",
				password: "flash123!",
			});
		expect(statusCode).toBe(200);

		const cookies = headers["set-cookie"];
		expect(cookies.length).toBe(1);
		expect(cookies[0]).toMatch(
			new RegExp(`^${COOKIE}=[A-Za-z0-9._-]+; Path=\\/; HttpOnly; SameSite=Strict$`)
		);
	});
	test("Invalid username", async () => {
		const { statusCode, headers } = await request(app)
			.post("/session")
			.send({
				username: "theFlash",
				password: "flash123!",
			});
		expect(statusCode).toBe(401);
		expect(headers["set-cookie"]).toBeUndefined();
	});
	test("Invalid password", async () => {
		const { statusCode, headers } = await request(app)
			.post("/session")
			.send({
				username: "theFlash1",
				password: "flash123",
			});
		expect(statusCode).toBe(401);
		expect(headers["set-cookie"]).toBeUndefined();
	});
	test("No data", async () => {
		const { statusCode, headers } = await request(app)
			.post("/session")
			.send();
		expect(statusCode).toBe(400);
		expect(headers["set-cookie"]).toBeUndefined();
	});
	test("Empty JSON", async () => {
		const { statusCode, headers } = await request(app)
			.post("/session")
			.send({});
		expect(statusCode).toBe(400);
		expect(headers["set-cookie"]).toBeUndefined();
	});
	test("Null values", async () => {
		const { statusCode, headers } = await request(app)
			.post("/session")
			.send({
				username: null,
				password: null,
			});
		expect(statusCode).toBe(400);
		expect(headers["set-cookie"]).toBeUndefined();
	});
	test("Missing username", async () => {
		const { statusCode, headers } = await request(app)
			.post("/session")
			.send({
				username: null,
				password: "flash123",
			});
		expect(statusCode).toBe(400);
		expect(headers["set-cookie"]).toBeUndefined();
	});
	test("Missing username", async () => {
		const { statusCode, headers } = await request(app)
			.post("/session")
			.send({
				username: null,
				password: "flash123",
			});
		expect(statusCode).toBe(400);
		expect(headers["set-cookie"]).toBeUndefined();
	});
});

describe("Delete session", () => {
	test("Delete a valid session", async () => {
		const { statusCode, headers } = await request(app)
			.delete("/session")
			.set('Cookie', [`${COOKIE}=${testUserToken}`])
			.send();
		expect(statusCode).toBe(200);

		const cookies = headers["set-cookie"];
		expect(cookies.length).toBe(1);
		expect(cookies[0]).toMatch(
			new RegExp(`^${COOKIE}=; Path=\\/; Expires=Thu, 01 Jan 1970 00:00:00 GMT$`)
		);
	});
	test("Delete an already deleted session", async () => {
		await request(app)
			.delete("/session")
			.set('Cookie', [`${COOKIE}=${testUserToken}`])
			.send();
		const { statusCode } = await request(app)
			.delete("/session")
			.set('Cookie', [`${COOKIE}=${testUserToken}`])
			.send();
		expect(statusCode).toBe(401);
	});
	test("Invalid session", async () => {
		const { statusCode, headers } = await request(app)
			.delete("/session")
			.set('Cookie', [`${COOKIE}=${wrongToken}`])
			.send();
		expect(statusCode).toBe(401);
		expect(headers["set-cookie"]).toBeUndefined();
	});
	test("No token", async () => {
		const { statusCode, headers } = await request(app)
			.delete("/session")
			.send();
		expect(statusCode).toBe(401);
		expect(headers["set-cookie"]).toBeUndefined();
	});
})
