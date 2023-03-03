import request from "supertest";
import { app } from "../../src/app.js";
import setup from "../setup.js";
import teardown from "../teardown.js";
import {signToken} from "../../src/utils/token.js";
import {COOKIE} from "../../src/constants/cookie.js";
import {User} from "../../src/models/index.js";
import seed from "../../src/data/seedFn.js";

beforeAll(setup);
afterAll(teardown);

const wrongToken = signToken("test", "test");
let testUserObject, testUserToken;
beforeEach(async () => {
  await seed(false);
  testUserObject = {
    username: "theFlash1",
    email: "flash@email.com",
    firstName: "Henry",
    lastName: "Allen",
    dob: new Date("1992-09-30").toISOString(),
    ratings: 0,
    tunes: 0
  };
  const user = await User.findOne({ username: testUserObject.username }).exec();
  const sessionId = await user.createSession();
  testUserToken = signToken(user._id, sessionId);
});

describe("GET /user when logged in", () => {
  test("returns 200 status when logged in", async () => {
    const {statusCode} = await request(app)
        .get("/user")
        .set('Cookie', [`${COOKIE}=${testUserToken}`]);
    expect(statusCode).toBe(200);
  });

  test("returns current user data", async () => {
    const { body } = await request(app)
      .get("/user")
      .set('Cookie', [`${COOKIE}=${testUserToken}`]);
    expect(body).toStrictEqual(testUserObject);
  });
});

describe("GET /user when not logged in", () => {
  test("returns 401", async () => {
    const { statusCode } = await request(app).get("/user");
    expect(statusCode).toBe(401);
  });

  test("returns 401 with wrong token", async () => {
    const { statusCode } = await request(app)
      .get("/user")
      .set('Cookie', [`${COOKIE}=${wrongToken}`]);
    expect(statusCode).toBe(401);
  });
});

describe("PUT /user when logged in", () => {
  test("returns 200 status", async () => {
    const { statusCode } = await request(app)
      .put("/user")
      .set('Cookie', [`${COOKIE}=${testUserToken}`]);
    expect(statusCode).toBe(200);
  });

  test("returns updated username", async () => {
    const { body } = await request(app)
      .put("/user")
      .set('Cookie', [`${COOKIE}=${testUserToken}`])
      .send({ newUsername: "fastestMan" });
    testUserObject.username = "fastestMan";
    expect(body).toStrictEqual(testUserObject);
  });

  test("returns updated email", async () => {
    const { body } = await request(app)
      .put("/user")
      .set('Cookie', [`${COOKIE}=${testUserToken}`])
      .send({ newEmail: "maninred@mail.com" });
    testUserObject.email = "maninred@mail.com";
    expect(body).toStrictEqual(testUserObject);
  });

  test("returns updated first name", async () => {
    const { body } = await request(app)
      .put("/user")
      .set('Cookie', [`${COOKIE}=${testUserToken}`])
      .send({ newFirstName: "Jay" });
    testUserObject.firstName = "Jay";
    expect(body).toStrictEqual(testUserObject);
  });

  test("returns updated last name", async () => {
    const { body } = await request(app)
      .put("/user")
      .set('Cookie', [`${COOKIE}=${testUserToken}`])
      .send({ newLastName: "Garrick" });
    testUserObject.lastName = "Garrick";
    expect(body).toStrictEqual(testUserObject);
  });

  test("returns updated dob", async () => {
    const date = new Date("1940-01-04");
    const { body } = await request(app)
      .put("/user")
      .set('Cookie', [`${COOKIE}=${testUserToken}`])
      .send({ newDob: date });
    testUserObject.dob = date.toISOString();
    expect(body).toStrictEqual(testUserObject);
  });
});

describe("PUT /user when not logged in", () => {
  test("returns 401 status", async () => {
    const { statusCode } = await request(app).put("/user");
    expect(statusCode).toBe(401);
  });

  test("returns 401 status with wrong token", async () => {
    const { statusCode } = await request(app)
      .put("/user")
      .set('Cookie', [`${COOKIE}=${wrongToken}`])
    expect(statusCode).toBe(401);
  });

  test("returns 401 status when updating username", async () => {
    const { statusCode } = await request(app)
      .get("/user")
      .set({ username: "theDarkKnigh" });
    expect(statusCode).toBe(401);
  });

  test("returns 401 status when updating email", async () => {
    const { statusCode } = await request(app)
      .get("/user")
      .set({ username: "dark_kight@mail.com" });
    expect(statusCode).toBe(401);
  });

  test("returns 401 status when updating first name", async () => {
    const { statusCode } = await request(app)
      .get("/user")
      .set({ username: "redacted" });
    expect(statusCode).toBe(401);
  });

  test("returns 401 status when updating last name", async () => {
    const { statusCode } = await request(app)
      .get("/user")
      .set({ username: "theDarkKnigh" });
    expect(statusCode).toBe(401);
  });

  test("returns 401 status when updating username", async () => {
    const { statusCode } = await request(app)
      .get("/user")
      .set({ username: "theDarkKnight" });
    expect(statusCode).toBe(401);
  });

  test("returns 401 status when updating date", async () => {
    const { statusCode } = await request(app)
      .get("/user")
      .set({ dob: new Date("1940-01-04") });
    expect(statusCode).toBe(401);
  });
});

describe("DELETE /user", () => {
  test("Returns 202 - Accepted status when logged in", async () => {
    const { statusCode } = await request(app)
      .delete("/user")
      .set('Cookie', [`${COOKIE}=${testUserToken}`])
    expect(statusCode).toBe(202);
  });

  test("Returns 401 status with no token", async () => {
    const { statusCode } = await request(app).delete("/user");
    expect(statusCode).toBe(401);
  });

  test("Returns 401 status with wrong token", async () => {
    const { statusCode } = await request(app)
      .delete("/user")
      .set('Cookie', [`${COOKIE}=${wrongToken}`])
    expect(statusCode).toBe(401);
  });
});
