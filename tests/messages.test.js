// backend/tests/messages.test.js

const request = require("supertest");
const express = require("express");
const fs = require("fs");
const path = require("path");
const messagesRoutes = require("../routes/messages");

const app = express();
app.use(express.json());
app.use("/api/messages", messagesRoutes);

// Mock messages.json path
const messagesFile = path.join(__dirname, "../data/messages.json");

describe("Messages API", () => {
  afterEach(() => {
    // Reset test data
    fs.writeFileSync(messagesFile, "[]");
  });

  test("should return empty message list initially", async () => {
    const res = await request(app).get("/api/messages");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  test("should sanitize and save message", async () => {
    const payload = {
      name: "Shafay!@#",
      email: "shafay@test.com",
      subject: "Test123",
      message: "<Hi> there!",
    };

    const res = await request(app)
      .post("/api/messages")
      .send(payload);

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("Message saved successfully");

    const stored = JSON.parse(fs.readFileSync(messagesFile, "utf8"));
    expect(stored[0].name).toBe("Shafay");
    expect(stored[0].subject).toBe("Test");
    expect(stored[0].message).toBe("Hi there!");
  });

  test("should return 400 if missing fields", async () => {
    const res = await request(app).post("/api/messages").send({ name: "Test" });
    expect(res.statusCode).toBe(400);
  });

  test("should return 404 on unknown route", async () => {
    const res = await request(app).get("/api/unknown");
    expect(res.statusCode).toBe(404);
  });
});
