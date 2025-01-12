// process.env.NODE_ENV = "test";

const mongoose = require("mongoose");
const app = require("../index");
const request = require("supertest");

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI_TEST, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("User Routes", () => {
  test("POST /user/signup - Should create a new user", async () => {
    const response = await request(app).post("/user/signup").send({
      email: "test@example.com",
      username: "testuser",
      password: "password123",
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("token");
    expect(response.body.account.username).toBe("testuser");
  });
});
