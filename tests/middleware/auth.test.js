import Role from "../../src/constants/roles.json" assert { type: "json" };
import {permissionLevel} from '../../src/middleware/auth.js';
import {expect, jest, test} from '@jest/globals';
import request from "supertest";
import { app } from "../../src/app.js";
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

    test("404 status returned when no user found", async () => {

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
			expect(statusCode).toBe(404);
    })
    // test("401 status returned when user level is less than  required permission level", () => {
    //     const middlewareFunction = permissionLevel(Role.ADMIN)
    //     let nextFunction= jest.fn();
    //     const mockResponse = () => {
    //         const res = {};
    //         res.status = jest.fn().mockReturnValue(res);
    //         res.json = jest.fn().mockReturnValue(res);
    //         return res;
    //       };
    //     let mockRequest = {user:
    //                             {role: Role.USER}
    //                         }

    //     const expectedResponse = middlewareFunction(mockRequest, mockResponse, nextFunction);

    //     expect(expectedResponse.status).toEqual(401);
    // })
})