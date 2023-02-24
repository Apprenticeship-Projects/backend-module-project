import { body, validationResult } from "express-validator";
import { checkErrors } from "../../src/middleware/validation.js";
import { app } from "../../src/app.js";
import request from "supertest";

describe('Test checkError', () => {

    test("400 status when there is an error raised.", async () => {


        app.get('/',
        body("testValue").notEmpty() ,
        checkErrors,
        async (req, res) => {
            res.sendStatus(200);
        });

        const { statusCode } = await request(app)
				.get("/")
				.send();
			expect(statusCode).toBe(400);
    })

    test("200 status when no error raised.", async () => {


        app.get('/test2',
        body("testValue").notEmpty() ,
        checkErrors,
        async (req, res) => {
            res.sendStatus(200);
        });

        const { statusCode } = await request(app)
				.get("/test2")
				.send({testValue: true});
			expect(statusCode).toBe(200);
    })

});