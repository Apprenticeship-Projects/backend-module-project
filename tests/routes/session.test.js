import { app } from "../../src/app.js";
import request from "supertest";
import setup from "../setup.js";
import teardown from "../teardown.js";

beforeAll(setup);
afterAll(teardown);

describe("/session", () => {
	it("Valid user", async () => {
		const { statusCode, headers } = await request(app)
			.post("/session")
			.send({
				username: "theFlash1",
				password: "flash123!",
			});
		expect(statusCode).toBe(200);

		const cookies = headers["set-cookie"];
		expect(cookies.length).toBe(1);
		expect(cookies[0]).toMatch(/token=[A-Za-z0-9._-]+; Path=\/; HttpOnly; SameSite=Strict/);
	});
	it("Invalid user", async () => {
		const { statusCode, headers } = await request(app)
			.post("/session")
			.send({
				username: "theFlash",
				password: "flash123!",
			});
		expect(statusCode).toBe(403);
		expect(headers["set-cookie"]).toBeUndefined();
	});
	it("Invalid password", async () => {
		const { statusCode, headers } = await request(app)
			.post("/session")
			.send({
				username: "theFlash1",
				password: "flash123",
			});
		expect(statusCode).toBe(403);
		expect(headers["set-cookie"]).toBeUndefined();
	});
	it("No data", async () => {
		const { statusCode, headers } = await request(app)
			.post("/session")
			.send();
		expect(statusCode).toBe(400);
		expect(headers["set-cookie"]).toBeUndefined();
	});
	it("Empty JSON", async () => {
		const { statusCode, headers } = await request(app)
			.post("/session")
			.send({});
		expect(statusCode).toBe(400);
		expect(headers["set-cookie"]).toBeUndefined();
	});
	it("Null values", async () => {
		const { statusCode, headers } = await request(app)
			.post("/session")
			.send({
				username: null,
				password: null,
			});
		expect(statusCode).toBe(400);
		expect(headers["set-cookie"]).toBeUndefined();
	});
	it("Missing username", async () => {
		const { statusCode, headers } = await request(app)
			.post("/session")
			.send({
				username: null,
				password: "flash123",
			});
		expect(statusCode).toBe(400);
		expect(headers["set-cookie"]).toBeUndefined();
	});
	it("Missing username", async () => {
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
