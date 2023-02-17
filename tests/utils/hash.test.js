import { createHash, verifyHash } from "../../src/utils/hash.js";

test("createHash() returns a hash", async () => {
    expect(await createHash("test"))
        .toMatch(new RegExp(`\\$2b\\$${process.env.SALT_COUNT}\\$[A-Za-z0-9\/.]+`));
});

test("verifyHash() returns the correct value", async () => {
    const hash = await createHash("test");
    expect(await verifyHash("test", hash)).toBe(true);
    expect(await verifyHash("test2", hash)).toBe(false);
});
