import request from "supertest";
import { app } from "../../src/app.js";
import setup from "../setup.js";
import teardown from "../teardown.js";
import { signToken } from "../../src/utils/token.js";
import { COOKIE } from "../../src/constants/cookie.js";
import { User } from "../../src/models/index.js";
import seed from "../../src/data/seedFn.js";
import { createHash } from "../../src/utils/hash.js";
import { toUTCDate } from "../../src/utils/utc.js";

beforeAll(setup);
afterAll(teardown);

const wrongToken = signToken("test", "test");
let testUserObject, testUserToken, testNewUser;
beforeEach(async () => {
  await seed(false);
  testUserObject = {
    username: "theGeneral",
    email: "leia.organa@mail.com",
    firstName: "Leia",
    lastName: "Organa",
    password: "useTheForce",
    dob: new Date("1998/07/14").toISOString(),
    ratings: 0,
    tunes: 0,
    role: 10,
  };
  const user = await User.findOne({ username: testUserObject.username }).exec();
  const sessionId = await user.createSession();
  testUserToken = signToken(user._id, sessionId);

  testNewUser = new User({
    username: "wonderwoman",
    email: "wonderwoman@mail.com",
    firstName: "Diana",
    lastName: "Prince",
    password: await createHash("Themyscira4ever"),
    dob: new Date("1941/02/23").toISOString(),
    role: 0,
  });

  await testNewUser.save();
});

describe("GET /admin/users when logged in as ADMIN", () => {
  test("returns 200 status when logged in", async () => {
    const { statusCode } = await request(app)
      .get("/admin/users")
      .set("Cookie", [`${COOKIE}=${testUserToken}`]);
    expect(statusCode).toBe(200);
  });

  test("returns all users data", async () => {
    const numUser = await User.countDocuments({}).exec();

    const { body } = await request(app)
      .get("/admin/users")
      .set("Cookie", [`${COOKIE}=${testUserToken}`]);
    expect(body.length).toBe(numUser);
  });
});

describe("GET /admin/users when not ADMIN", () => {
  test("returns 401 when not logged in", async () => {
    const { statusCode } = await request(app).get("/user");
    expect(statusCode).toBe(401);
  });

  test("returns 401 with wrong token", async () => {
    const { statusCode } = await request(app)
      .get("/user")
      .set("Cookie", [`${COOKIE}=${wrongToken}`]);
    expect(statusCode).toBe(401);
  });
});

describe("GET /admin/users when logged in as ADMIN", () => {
  test("should return user by username", async () => {
    const { body } = await request(app)
      .get("/admin/users/" + testNewUser.username)
      .set("Cookie", [`${COOKIE}=${testUserToken}`]);

    expect(body.username).toBe(testNewUser.username);
  });

  test("should return 404 error if user does not exists", async () => {
    const { statusCode } = await request(app)
      .get("/admin/users/" + { username: "test" })
      .set("Cookie", [`${COOKIE}=${testUserToken}`]);

    expect(statusCode).toBe(404);
  });
});

describe("PUT /admin/users when logged in as ADMIN", () => {
  test("returns 200 status", async () => {
    const { statusCode } = await request(app)
      .put("/admin/users/" + testNewUser.username)
      .set("Cookie", [`${COOKIE}=${testUserToken}`]);
    expect(statusCode).toBe(200);
  });

  test("returns updated username", async () => {
    const { body } = await request(app)
      .put("/admin/users/" + testNewUser.username)
      .set("Cookie", [`${COOKIE}=${testUserToken}`])
      .send({ newUsername: "fastestMan" });
    testNewUser.username = "fastestMan";
    expect(body.username).toStrictEqual(testNewUser.username);
  });

  test("returns updated email", async () => {
    const { body } = await request(app)
      .put("/admin/users/" + testNewUser.username)
      .set("Cookie", [`${COOKIE}=${testUserToken}`])
      .send({ newEmail: "maninred@mail.com" });
    testNewUser.email = "maninred@mail.com";
    expect(body.email).toStrictEqual(testNewUser.email);
  });

  test("returns updated first name", async () => {
    const { body } = await request(app)
      .put("/admin/users/" + testNewUser.username)
      .set("Cookie", [`${COOKIE}=${testUserToken}`])
      .send({ newFirstName: "Jay" });
    testNewUser.firstName = "Jay";
    expect(body.firstName).toStrictEqual(testNewUser.firstName);
  });

  test("returns updated last name", async () => {
    const { body } = await request(app)
      .put("/admin/users/" + testNewUser.username)
      .set("Cookie", [`${COOKIE}=${testUserToken}`])
      .send({ newLastName: "Garrick" });
    testNewUser.lastName = "Garrick";
    expect(body.lastName).toStrictEqual(testNewUser.lastName);
  });

  test("returns updated dob", async () => {
    const date = new Date("1940-01-04");
    const { body } = await request(app)
      .put("/admin/users/" + testNewUser.username)
      .set("Cookie", [`${COOKIE}=${testUserToken}`])
      .send({ newDob: date });
    testNewUser.dob = toUTCDate(date);
    console.log(testNewUser.dob);
    expect(body.dob).toStrictEqual(testNewUser.dob.toISOString());
  });
});

describe("PUT /admin/users when not ADMIN", () => {
  test("returns 401 status when not logged in", async () => {
    const { statusCode } = await request(app).put(
      "/admin/users/" + testNewUser.username
    );
    expect(statusCode).toBe(401);
  });

  test("returns 401 status with wrong token", async () => {
    const { statusCode } = await request(app)
      .put("/admin/users/" + testNewUser.username)
      .set("Cookie", [`${COOKIE}=${wrongToken}`]);
    expect(statusCode).toBe(401);
  });

  test("returns 401 status when updating username", async () => {
    const { statusCode } = await request(app)
      .get("/admin/users/" + testNewUser.username)
      .set({ username: "theDarkKnigh" });
    expect(statusCode).toBe(401);
  });

  test("returns 401 status when updating email", async () => {
    const { statusCode } = await request(app)
      .get("/admin/users/" + testNewUser.username)
      .set({ username: "dark_kight@mail.com" });
    expect(statusCode).toBe(401);
  });

  test("returns 401 status when updating first name", async () => {
    const { statusCode } = await request(app)
      .get("/admin/users/" + testNewUser.username)
      .set({ username: "redacted" });
    expect(statusCode).toBe(401);
  });

  test("returns 401 status when updating last name", async () => {
    const { statusCode } = await request(app)
      .get("/admin/users/" + testNewUser.username)
      .set({ username: "theDarkKnigh" });
    expect(statusCode).toBe(401);
  });

  test("returns 401 status when updating username", async () => {
    const { statusCode } = await request(app)
      .get("/admin/users/" + testNewUser.username)
      .set({ username: "theDarkKnight" });
    expect(statusCode).toBe(401);
  });

  test("returns 401 status when updating date", async () => {
    const { statusCode } = await request(app)
      .get("/admin/users/" + testNewUser.username)
      .set({ dob: new Date("1940-01-04") });
    expect(statusCode).toBe(401);
  });
});

describe("DELETE /admin/users when logged in as ADMIN", () => {
  test("Returns 202 - Accepted status when logged in", async () => {
    const { statusCode } = await request(app)
      .delete("/admin/users/" + testNewUser.username)
      .set("Cookie", [`${COOKIE}=${testUserToken}`]);
    expect(statusCode).toBe(202);
  });

  test("Returns 401 status with no token", async () => {
    const { statusCode } = await request(app).delete(
      "/admin/users/" + testNewUser.username
    );
    expect(statusCode).toBe(401);
  });

  test("Returns 401 status with wrong token", async () => {
    const { statusCode } = await request(app)
      .delete("/admin/users/" + testNewUser.username)
      .set("Cookie", [`${COOKIE}=${wrongToken}`]);
    expect(statusCode).toBe(401);
  });
});
