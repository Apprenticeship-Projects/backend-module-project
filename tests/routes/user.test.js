import request from "supertest";
import { app } from "../../src/app.js";
import seed from "../../src/data/seedFn.js";

let testUserObject;
const token = "sign token myself"; // sign with my secret for testing
const wrongToken = "sign token for wrong user myself"; // sign with my secret for testing

beforeEach(() => {
  seed(false);
  testUserObject = {
    username: "theFlash1",
    email: "flash@email.com",
    firstName: "Henry",
    lastName: "Allen",
    dob: new Date("1992-09-29"),
  };
});

describe("GET /user when logged in", () => {
  test("returns 200 status when logged in", async () => {
    const { statusCode } = await request(app)
      .get("/user")
      .set("Authorization", `Bearer ${token}`);
    expect(statusCode).toBe(200);
  });

  test("returns current user data", async () => {
    const { user } = await request(app)
      .get("/user")
      .set("Authorization", `Bearer ${token}`);
    expect(user).toBe(testUserObject);
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
      .set("Authorization", `Bearer ${wrongToken}`);
    expect(statusCode).toBe(401);
  });
});

describe("PUT /user when logged in", () => {
  test("returns 200 status", async () => {
    const { statusCode } = await request(app)
      .put("/user")
      .set("Authorization", `Bearer ${token}`);
    expect(statusCode).toBe(200);
  });

  test("returns updated username", async () => {
    const { user } = await request(app)
      .get("/user")
      .set("Authorization", `Bearer ${token}`)
      .set({ username: "fastestMan" });
    testUserObject.username = "fastestMan";
    expect(user).toBe(testUserObject);
  });

  test("returns updated email", async () => {
    const { user } = await request(app)
      .get("/user")
      .set("Authorization", `Bearer ${token}`)
      .set({ email: "maninred@mail.com" });
    testUserObject.email = "maninred@mail.com";
    expect(user).toBe(testUserObject);
  });

  test("returns updated first name", async () => {
    const { user } = await request(app)
      .get("/user")
      .set("Authorization", `Bearer ${token}`)
      .set({ firstName: "Jay" });
    testUserObject.firstName = "Jay";
    expect(user).toBe(testUserObject);
  });

  test("returns updated last name", async () => {
    const { user } = await request(app)
      .get("/user")
      .set("Authorization", `Bearer ${token}`)
      .set({ lastName: "Garrick" });
    testUserObject.lastName = "Garrick";
    expect(user).toBe(testUserObject);
  });

  test("returns updated dob", async () => {
    const date = new Date("1940-01-04");
    const { user } = await request(app)
      .get("/user")
      .set("Authorization", `Bearer ${token}`)
      .set({ dob: date });
    testUserObject.dob = date;
    expect(user).toBe(testUserObject);
  });
});

describe("PUT /user when not logged in", () => {
  test("returns 401 status", async () => {
    const { statusCode } = await request(app).put("/user");
    expect(statusCode).toBe(200);
  });

  test("returns 401 status with wrong token", async () => {
    const { statusCode } = await request(app)
      .put("/user")
      .set("Authorization", `Bearer ${wrongToken}`);
    expect(statusCode).toBe(200);
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
      .set("Authorization", `Bearer ${token}`);
    expect(statusCode).toBe(202);
  });

  test("Returns 401 status with no token", async () => {
    const { statusCode } = await request(app).delete("/user");
    expect(statusCode).toBe(401);
  });

  test("Returns 401 status with wrong token", async () => {
    const { statusCode } = await request(app)
      .delete("/user")
      .set("Authorization", `Bearer ${wrongToken}`);
    expect(statusCode).toBe(401);
  });
});
