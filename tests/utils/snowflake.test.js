import newID from "../../src/utils/snowflake.js";

test("newID() generates an ID", () => {
    expect(newID()).toMatch(/[0-9]{17,}/);
});
