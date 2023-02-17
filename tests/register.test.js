import {app} from "../src/app.js";
import request from "supertest";
// import {User} from '../models/index.js';

describe("Register a user", () => {
    describe("With valid values", () => {
        it("Returns 200 status", async () => {
            const { statusCode } = await request(app).post("/register").send({  email:"teddyputus1@gmail.com", password:"thisisapassword", username:"Tedernator", firstName:"Teddy", lastName:"Putus", dob: "21/12/1992"});
            expect(statusCode).toBe(200);
        })
        it("User exists in the database", async () => {
            const user = await User.find().byEmail("teddyputus1@gmail.com");
            expect(user.username).toBe("Tedernator")
        })
    })
    describe("With invalid values, returns 400", () => {
        it("Returns 400 when username not unique", async () => {
            const { statusCode } = await request(app).post("/register").send({  email:"teddyputus2@gmail.com", password:"thisisapassword", username:"Tedernator", firstName:"Teddy", lastName:"Putus", dob: "21/12/1992"});
        })
        it("Returns 400 when username has spaces", async () => {
            const { statusCode } = await request(app).post("/register").send({  email:"teddyputus2@gmail.com", password:"thisisapassword", username:"Teder nator2", firstName:"Teddy", lastName:"Putus", dob: "21/12/1992"});
            expect(statusCode).toBe(400);
        })
        it("Returns 400 when username not alphanumeric, not underscore", async () => {
            const { statusCode } = await request(app).post("/register").send({  email:"teddyputus2@gmail.com", password:"thisisapassword", username:"Teder-nator",  firstName:"Teddy", lastName:"Putus", dob: "21/12/1992"});
            expect(statusCode).toBe(400);
        })
        it("Returns 400 when email not unique", async () => {
            const { statusCode } = await request(app).post("/register").send({  email:"teddyputus2@gmail.com", password:"thisisapassword", username:"Tedernator2",  firstName:"Teddy", lastName:"Putus", dob: "21/12/1992"});
            expect(statusCode).toBe(400);
        })
        it("Returns 400 when email not an email address", async () => {
            const { statusCode } = await request(app).post("/register").send({  email:"teddyputus2.gmail.com", password:"thisisapassword", username:"Tedernator3",  firstName:"Teddy", lastName:"Putus", dob: "21/12/1992"});
            expect(statusCode).toBe(400);
        })
        it("Returns 400 when password too short", async () => {
            const { statusCode } = await request(app).post("/register").send({  email:"teddyputus6@gmail.com", password:"pass", username:"Tedernator3",  firstName:"Teddy", lastName:"Putus", dob: "21/12/1992"});
            expect(statusCode).toBe(400);
        })
        it("Returns 400 when password too long", async () => {
            const { statusCode } = await request(app).post("/register").send({  email:"teddyputus6@gmail.com", password:"thisisapasswordthisisapassword", username:"Tedernator3",  firstName:"Teddy", lastName:"Putus", dob: "21/12/1992"});
            expect(statusCode).toBe(400);
        })
        it("Returns 400 when password has spaces", async () => {
            const { statusCode } = await request(app).post("/register").send({  email:"teddyputus7@gmail.com", password:"this is a password", username:"Tedernator4",  firstName:"Teddy", lastName:"Putus", dob: "21/12/1992"});
            expect(statusCode).toBe(400);
        })
        it("Returns 400 when user too young (<13)", async () => {
            const { statusCode } = await request(app).post("/register").send({  email:"teddyputus7@gmail.com", password:"thisisapassword", username:"Tedernator4",  firstName:"Teddy", lastName:"Putus", dob: "21/12/2013"});
            expect(statusCode).toBe(400);
        })
    }) 
})