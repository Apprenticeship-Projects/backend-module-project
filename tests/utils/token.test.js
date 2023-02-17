import { signToken, verifyToken } from "../../src/utils/token.js";

test("sign() returns a string", () => {
    expect(typeof signToken("test")).toBe("string");
});

describe("verify()", () => {
    test("verify() returns an object", () => {
        const token = signToken("test");
        const obj = verifyToken(token);

        expect(Object.keys(obj).length).toBe(3);
        expect(obj.id).toBe("test");
        expect(obj.iat.toString()).toMatch(/[0-9]{10,}/);
        expect(obj.exp.toString()).toMatch(/[0-9]{10,}/);
    });
    test("verify() throws an error on an incorrect token", () => {
        const token = "test";
        expect(() => verifyToken(token)).toThrow();
    });
});
