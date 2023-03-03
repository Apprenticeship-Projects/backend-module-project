import Role from "../../src/constants/roles.json" assert { type: "json" };
import {permissionLevel, auth} from '../../src/middleware/auth.js';
import {expect, test} from '@jest/globals';
import request from "supertest";
import { app } from "../../src/app.js";
import { COOKIE } from "../../src/constants/cookie.js";
import seed from "../../src/data/seedFn.js";
import { User } from "../../src/models/index.js";
import { signToken } from "../../src/utils/token";
import setup from "../setup.js";
import teardown from "../teardown.js";




describe('Test permissionLevel middleware', () => {

    test("permissionLevel authorised when user level is greater than or equal to required permission level", async () => {

        const middlewareFunction = permissionLevel(Role.USER);

        app.get('/', (req, res, next) => {
            req.user = req.body.user;
            next();
        },
        middlewareFunction,
        async (req, res) => {
            res.sendStatus(200);
        });

        const { statusCode } = await request(app)
				.get("/")
				.send({
					user:{role: Role.ADMIN}
				});
			expect(statusCode).toBe(200);
    })

    test("401 status returned when user level is less than  required permission level", async () => {

        const middlewareFunction = permissionLevel(Role.ADMIN);

        app.get('/test2', (req, res, next) => {
            req.user = req.body.user;
            next();
        },
        middlewareFunction, async (req, res) => {
            res.sendStatus(200);
        });

        const { statusCode } = await request(app)
				.get("/test2")
				.send({
					user:{role: Role.USER}
				});
			expect(statusCode).toBe(401);
    })

    test("401 status returned when no user found", async () => {

        const middlewareFunction = permissionLevel(Role.ADMIN);

        app.get('/',
            (req, res, next) => {
                req.user = req.body.user;
                next();
            },
            middlewareFunction,
            async (req, res) => {
                res.sendStatus(200);
            });

        const { statusCode } = await request(app)
				.get("/")
				.send({someRandomThing:0});
			expect(statusCode).toBe(401);
    })
})

describe("Test the auth middleware function", () => {
    beforeAll(setup);
    afterAll(teardown);

    beforeEach(async () => {
        await seed(false);
    });


    test("auth function lets us pass if session and user match", async () => {

        const testUser = await User.findOne().exec();

        if (!testUser) throw new Error("Test user not found in db");

        const sessionId = await testUser.createSession();
        const testUserToken = signToken(testUser._id, sessionId);
        await testUser.save();

        app.get('/test3',
        auth,
        async (req, res) => {
            res.sendStatus(200);
        });

        const { statusCode } = await request(app)
				.get("/test3")
				.set('Cookie', [`${COOKIE}=${testUserToken}`]);
			expect(statusCode).toBe(200);
    })
})
