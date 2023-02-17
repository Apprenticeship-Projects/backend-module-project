import request from "supertest";
import { app } from "../../src/app.js";

// beforeEach(async () => {
//   await seed();
//   // user to seed test db {username: "batman", email: 'iamthenight@mail.com', firstName:"Bruce", lastName: "Wyane", password: 'theD@rk_Kn!ght' dob: "01/03/1963"}
// });

const token = "sign token myself"; // sign with my secret for testing
const wrongToken = "sign token for wrong user myself"; // sign with my secret for testing

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
    expect(user).toBe({
      username: "batman",
      email: "iamthenight@mail.com",
      firstName: "Bruce",
      lastName: "Wyane",
      dob: "1963/03/01",
    });
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
      .set({ username: "theDarkKnigh" });
    expect(user).toBe({
      username: "theDarkKnight",
      email: "iamthenight@mail.com",
      firstName: "Bruce",
      lastName: "Wyane",
      dob: "1963/03/01",
    });
  });

  test("returns updated email", async () => {
    const { user } = await request(app)
      .get("/user")
      .set("Authorization", `Bearer ${token}`)
      .set({ username: "dark_kight@mail.com" });
    expect(user).toBe({
      username: "batman",
      email: "dark_kignt@mail.com",
      firstName: "Bruce",
      lastName: "Wyane",
      dob: "1963/03/01",
    });
  });

  test("returns updated first name", async () => {
    const { user } = await request(app)
      .get("/user")
      .set("Authorization", `Bearer ${token}`)
      .set({ username: "redacted" });
    expect(user).toBe({
      username: "batman",
      email: "iamthenight@mail.com",
      firstName: "redacted",
      lastName: "Wyane",
      dob: "1963/03/01",
    });
  });

  test("returns updated last name", async () => {
    const { user } = await request(app)
      .get("/user")
      .set("Authorization", `Bearer ${token}`)
      .set({ username: "theDarkKnigh" });
    expect(user).toBe({
      username: "batman",
      email: "iamthenight@mail.com",
      firstName: "Bruce",
      lastName: "redacted",
      dob: "1963/03/01",
    });
  });

  test("returns updated username", async () => {
    const { user } = await request(app)
      .get("/user")
      .set("Authorization", `Bearer ${token}`)
      .set({ username: "theDarkKnigh" });
    expect(user).toBe({
      username: "batman",
      email: "iamthenight@mail.com",
      firstName: "Bruce",
      lastName: "Wyane",
      dob: "1963/03/01",
    });
  });

  test("returns updated date", async () => {
    const { user } = await request(app)
      .get("/user")
      .set("Authorization", `Bearer ${token}`)
      .set({ username: "1988/12/12" });
    expect(user).toBe({
      username: "batman",
      email: "iamthenight@mail.com",
      firstName: "Bruce",
      lastName: "Wyane",
      dob: "1988/12/12",
    });
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
      .set({ username: "theDarkKnigh" });
    expect(statusCode).toBe(401);
  });

  test("returns 401 status when updating date", async () => {
    const { statusCode } = await request(app)
      .get("/user")
      .set({ username: "1988/12/12" });
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
