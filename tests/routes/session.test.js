import { app } from "../../src/app.js";
import request from "supertest";
import setup from "../setup.js";
import teardown from "../teardown.js";

beforeAll(setup);
afterAll(teardown);

describe("/session", () => {
	it("Valid user", async () => {
		const { statusCode } = await request(app)
			.post("/session")
			.send({
				username: "theFlash1",
				password: "flash123!",
			});
		expect(statusCode).toBe(200);
	});
	it("Invalid user", async () => {
		const { statusCode } = await request(app)
			.post("/session")
			.send({
				username: "theFlash1",
				password: "flash123",
			});
		expect(statusCode).toBe(403);
	});
	it("No data", async () => {
		const { statusCode } = await request(app)
			.post("/session")
			.send();
		expect(statusCode).toBe(400);
	});
	it("Empty JSON", async () => {
		const { statusCode } = await request(app)
			.post("/session")
			.send({});
		expect(statusCode).toBe(400);
	});
	it("Null values", async () => {
		const { statusCode } = await request(app)
			.post("/session")
			.send({
				username: null,
				password: null,
			});
		expect(statusCode).toBe(400);
	});
	it("Missing username", async () => {
		const { statusCode } = await request(app)
			.post("/session")
			.send({
				username: null,
				password: "flash123",
			});
		expect(statusCode).toBe(400);
	});
	it("Missing username", async () => {
		const { statusCode } = await request(app)
			.post("/session")
			.send({
				username: null,
				password: "flash123",
			});
		expect(statusCode).toBe(400);
	});
});
