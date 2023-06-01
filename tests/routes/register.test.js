import { app } from "../../src/app.js";
import request from "supertest";
import setup from "../setup.js";
import teardown from "../teardown.js";

beforeAll(setup);
afterAll(teardown);

// beforeAll(async () => {
//     // app.listen(process.env.PORT, async() => {
//     //     await connect();
//     // });
//     mongoose.set("strictQuery", false); // The default in Mongoose 7
//     await mongoose.connect('mongodb://127.0.0.1:27017/backend-module-project');
// })
//
// afterAll(async () => {
//     // app.close();
// })

describe("With valid values", () => {
	test("Returns 200 status", async () => {
		const { statusCode, headers } = await request(app)
			.post("/register")
			.send({
				email: "teddyputus1@gmail.com",
				password: "thisisapassword",
				username: "Tedernator",
				firstName: "Teddy",
				lastName: "Putus",
				dob: "1992/12/21",
			});
		expect(statusCode).toBe(200);
		expect(headers["Authorization"] !== false).toBe(true);
	});
});
describe("With invalid values, returns 400", () => {
	test("Returns 400 when username not unique", async () => {
		const { statusCode } = await request(app).post("/register").send({
			email: "teddyputus2@gmail.com",
			password: "thisisapassword",
			username: "Tedernator",
			firstName: "Teddy",
			lastName: "Putus",
			dob: "1992/12/21",
		});
		expect(statusCode).toBe(400);
	});
	test("Returns 400 when username has spaces", async () => {
		const { statusCode } = await request(app).post("/register").send({
			email: "teddyputus2@gmail.com",
			password: "thisisapassword",
			username: "Teder nator2",
			firstName: "Teddy",
			lastName: "Putus",
			dob: "1992/12/21",
		});
		expect(statusCode).toBe(400);
	});
	test("Returns 400 when username not alphanumeric, not underscore", async () => {
		const { statusCode } = await request(app).post("/register").send({
			email: "teddyputus2@gmail.com",
			password: "thisisapassword",
			username: "Teder-nator",
			firstName: "Teddy",
			lastName: "Putus",
			dob: "1992/12/21",
		});
		expect(statusCode).toBe(400);
	});
	test("Returns 400 when email not unique", async () => {
		const { statusCode } = await request(app).post("/register").send({
			email: "teddyputus1@gmail.com",
			password: "thisisapassword",
			username: "Tedernator2",
			firstName: "Teddy",
			lastName: "Putus",
			dob: "1992/12/21",
		});
		expect(statusCode).toBe(400);
	});
	test("Returns 400 when email not an email address", async () => {
		const { statusCode } = await request(app).post("/register").send({
			email: "teddyputus2.gmail.com",
			password: "thisisapassword",
			username: "Tedernator3",
			firstName: "Teddy",
			lastName: "Putus",
			dob: "1992/12/21",
		});
		expect(statusCode).toBe(400);
	});
	test("Returns 400 when password too short", async () => {
		const { statusCode } = await request(app).post("/register").send({
			email: "teddyputus6@gmail.com",
			password: "pass",
			username: "Tedernator3",
			firstName: "Teddy",
			lastName: "Putus",
			dob: "1992/12/21",
		});
		expect(statusCode).toBe(400);
	});
	test("Returns 400 when password too long", async () => {
		const { statusCode } = await request(app).post("/register").send({
			email: "teddyputus6@gmail.com",
			password: "thisisapasswordthisisapassword",
			username: "Tedernator3",
			firstName: "Teddy",
			lastName: "Putus",
			dob: "1992/12/21",
		});
		expect(statusCode).toBe(400);
	});
	test("Returns 400 when password has spaces", async () => {
		const { statusCode } = await request(app).post("/register").send({
			email: "teddyputus7@gmail.com",
			password: "this is a password",
			username: "Tedernator4",
			firstName: "Teddy",
			lastName: "Putus",
			dob: "1992/12/21",
		});
		expect(statusCode).toBe(400);
	});
	test("Returns 400 when user too young (<13)", async () => {
		const { statusCode } = await request(app).post("/register").send({
			email: "teddyputus7@gmail.com",
			password: "thisisapassword",
			username: "Tedernator4",
			firstName: "Teddy",
			lastName: "Putus",
			dob: "2013/12/21",
		});
		expect(statusCode).toBe(400);
	});
});
