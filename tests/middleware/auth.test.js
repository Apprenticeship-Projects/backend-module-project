import Role from "../../src/constants/roles.json" assert { type: "json" };
import {permissionLevel} from '../../src/middleware/auth.js';
import {expect, jest, test} from '@jest/globals';

describe('Test permissionLevel middleware', () => {
    let mockRequest, mockResponse;
    let nextFunction= jest.fn();

  
    test("permissionLevel authorised when user level is greater than or equal to required permission level", () => {
        const middlewareFunction = permissionLevel(Role.User)

        mockRequest.user.role = Role.ADMIN;

        const expectedResponse = middlewareFunction(mockRequest, mockResponse, nextFunction);

        expect(nextFunction).toBeCalledWith(expectedResponse);
    })
    

})