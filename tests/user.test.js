import request from "supertest";
import { app } from "../src/app.js";
import User from "../src/models/User.model.js";

describe("GET /user", () => {
  // beforeEach(async () => {
  //   await seed();
  //   // user to seed test db {username: "batman", email: 'iamthenight@mail.com', firstName:"Bruce", lastName: "Wyane", password: 'theD@rk_Kn!ght' dob: "01/03/1963"}
  // });

  const token = "sign token myself"; // sign with my secret for testing

  test("returns 200 status", async () => {
    const { statusCode } = await request(app).get("/user");
    expect(statusCode).toBe(200);
  });

  test("returns user data", async () => {
    const { user } = await request(app)
      .get("/user")
      .set("Authorization", `Bearer ${token}`);

    expect(user).toBe({
      username: "batman",
      email: "iamthenight@mail.com",
      firstName: "Bruce",
      lastName: "Wyane",
      dob: "01/03/1963",
    });
  });
});

describe("PUT /user", () => {
  test("Returns 200 status", async () => {
    const { statusCode } = await request(app).put("/user");
    expect(statusCode).toBe(200);
  });
});

describe("DELETE /user", () => {
  test("Returns 202 - Accepted status", async () => {
    const { statusCode } = await request(app).delete("/user");
    expect(statusCode).toBe(202);
  });
});
