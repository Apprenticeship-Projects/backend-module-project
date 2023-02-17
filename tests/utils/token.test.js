import { sign, verify } from "../../src/utils/token.js";

test("sign() returns a string", () => {
    expect(typeof sign("test")).toBe("string");
});

test("verify() returns an object", () => {
    const token = sign("test");
    const obj = verify(token);
    expect(Object.keys(obj).length).toBe(3);
    expect(obj.id).toBe("test");
    expect(obj.iat.toString()).toMatch(/[0-9]{10,}/);
    expect(obj.exp.toString()).toMatch(/[0-9]{10,}/);
});
