import {app} from "../src/app.js";
import request from "supertest";
// import {User} from '../models/index.js';

describe("Register a user", () => {
    describe("With valid values", () => {
        it("Returns 200 status", async () => {
            const { statusCode } = await request(app).post("/register").send({  email:"teddyputus1@gmail.com", password:"thisisapassword", username:"Tedernator" });
            expect(statusCode).toBe(200);
        })
        it("User exists in the database", async () => {
            const user = await User.findOne({where:{email: "teddyputus1@gmail.com"}})
            expect(user.username).toBe("Tedernator")
        })
    })
    describe("With invalid values, returns 400", () => {
        it("Returns 400 when username not unique", async () => {
            const { statusCode } = await request(app).post("/register").send({  email:"teddyputus2@gmail.com", password:"thisisapassword", username:"Tedernator" });
            expect(statusCode).toBe(400);
        })
        it("Returns 400 when username has spaces", async () => {
            const { statusCode } = await request(app).post("/register").send({  email:"teddyputus2@gmail.com", password:"thisisapassword", username:"Teder nator2" });
            expect(statusCode).toBe(400);
        })
        it("Returns 400 when username not alphanumeric", async () => {
            const { statusCode } = await request(app).post("/register").send({  email:"teddyputus2@gmail.com", password:"thisisapassword", username:"Teder-nator2!" });
            expect(statusCode).toBe(400);
        })
        it("Returns 400 when email not unique", async () => {
            const { statusCode } = await request(app).post("/register").send({  email:"teddyputus1@gmail.com", password:"thisisapassword", username:"Tedernator2" });
            expect(statusCode).toBe(400);
        })
        it("Returns 400 when email not an email address", async () => {
            const { statusCode } = await request(app).post("/register").send({  email:"teddyputus1.com", password:"thisisapassword", username:"Tedernator2" });
            expect(statusCode).toBe(400);
        })
        it("Returns 400 when password too short", async () => {
            const { statusCode } = await request(app).post("/register").send({  email:"teddyputus2.com", password:"short", username:"Tedernator2" });
            expect(statusCode).toBe(400);
        })
        it("Returns 400 when password has spaces", async () => {
            const { statusCode } = await request(app).post("/register").send({  email:"teddyputus2.com", password:"short pass", username:"Tedernator2" });
            expect(statusCode).toBe(400);
        })
    }) 
})