import { signToken, verifyToken } from "../../src/utils/token.js";

test("sign() returns a string", () => {
    expect(typeof signToken("testuid", "testses")).toBe("string");
});

describe("verify()", () => {
    test("verify() returns an object", () => {
        const token = signToken("testuid", "testses");
        const obj = verifyToken(token);

        expect(Object.keys(obj).length).toBe(4);
        expect(obj.uid).toBe("testuid");
        expect(obj.ses).toBe("testses");
        expect(obj.iat.toString()).toMatch(/[0-9]{10,}/);
        expect(obj.exp.toString()).toMatch(/[0-9]{10,}/);
    });
    test("verify() throws an error on an incorrect token", () => {
        const token = "test";
        expect(() => verifyToken(token)).toThrow();
    });
});
