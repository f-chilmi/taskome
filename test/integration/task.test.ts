// test/integration/task.test.ts
import request from "supertest";
import app from "../../src/app";
import mongoose from "mongoose";
import { Task } from "../../src/models/task.model";
import { expect } from "chai";

describe("Tasks API Endpoints", () => {
  beforeAll(async () => {
    await mongoose.connect(
      process.env.TEST_MONGO_URI || "mongodb://localhost:27017/testdb"
    );
    await Task.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  beforeEach(async () => {
    await Task.deleteMany({});
  });

  it("should create a new task", async () => {
    const taskData = { title: "New API Task", description: "API Description" };
    const response = await request(app)
      .post("/tasks")
      .send(taskData)
      .expect(201);

    expect(response.body).to.be.an("object"); // Chai assertion
    expect(response.body.message).to.equal("Task created successfully"); // Chai assertion
    expect(response.body.data).to.have.property("_id"); // Chai assertion
    expect(response.body.data.title).to.equal(taskData.title); // Chai assertion
  });

  it("should get a list of tasks", async () => {
    await Task.create({ title: "Task 1" });
    await Task.create({ title: "Task 2" });

    const response = await request(app).get("/tasks").expect(200);

    expect(response.body).to.be.an("object"); // Chai assertion
    expect(response.body.data).to.be.an("array"); // Chai assertion
    expect(response.body.data).to.have.length.greaterThanOrEqual(2); // Chai assertion
  });
});
