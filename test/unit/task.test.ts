import request from "supertest";
import app from "../../src/app";
import { Task } from "../../src/models";
import taskList from "../fixtures/tasks.json";
import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { RoleEnum } from "../../src/types";
import mongoose, { Types } from "mongoose";

const mockingoose = require("mockingoose");

// Mock the userService findUserById function
jest.mock("../../src/services/user.service", () => ({
  userService: {
    findUserById: jest.fn(),
  },
}));

// Import the userService to be able to mock it
import { userService } from "../../src/services";

// Mock authMiddleware to set the user ID
jest.mock("../../src/middlewares/isAuth.middleware", () => ({
  isAuth: (req: { user: { id: string } }, _res: any, next: () => void) => {
    req.user = { id: "admin_id" };
    next();
  },
}));

// Helper function to create a mock mongoose document
function createMockMongooseDoc(data: any) {
  // Create an object with all the properties a mongoose document needs
  const doc = {
    ...data,
    // Add Mongoose document properties and methods
    _id: new Types.ObjectId(data.id || "507f1f77bcf86cd799439011"),
    id: data.id || "507f1f77bcf86cd799439011",
    __v: 0,
    // Add some common mongoose document methods as jest functions
    save: jest.fn<any>().mockResolvedValue(data),
    toObject: jest.fn().mockReturnValue(data),
    toJSON: jest.fn().mockReturnValue(data),
  };

  return doc;
}

const generateTestToken = () => {
  return "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MDg3YTUxYTRhMmUyODU3ZjVmMTgwYyIsImlhdCI6MTc0NTM4OTU1NCwiZXhwIjoyMzUwMTg5NTU0fQ.lhCkRk88jXW0dhvBXmsI-wOWjNEZHzUS6gX4Qqf2ZR4";
};

describe("Task route", () => {
  beforeEach(() => {
    mockingoose.resetAll();
    jest.clearAllMocks();
  });

  const mockTask = {
    id: "123",
    title: "New Task",
    status: "notStarted",
  };

  it("should create a new task", async () => {
    mockingoose(Task).toReturn(mockTask, "create");

    const res = await request(app)
      .post("/api/v1/tasks/")
      .send({ title: "New Task", status: "notStarted" })
      .set("Authorization", generateTestToken());

    expect(res.status).toBe(201);
    expect(res.body.data.title).toBe("New Task");
  });

  it("should get task list", async () => {
    mockingoose(Task).toReturn([mockTask], "find");
    mockingoose(Task).toReturn(1, "countDocuments");

    const res = await request(app).get("/api/v1/tasks");

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
  });

  it("should delete task if user is admin", async () => {
    // Mock the userService to return an admin user
    const adminUser = createMockMongooseDoc({
      id: "admin_id",
      role: RoleEnum.ADMIN,
    });

    // (userService.findUserById as jest.Mock).mockResolvedValue(adminUser);
    (userService.findUserById as jest.Mock<any>).mockResolvedValue(adminUser);

    mockingoose(Task).toReturn(mockTask, "findOneAndDelete");

    const res = await request(app)
      .delete("/api/v1/tasks/123")
      .set("Authorization", generateTestToken());

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Task deleted successfully");
  });

  it("should return 403 if user is not admin", async () => {
    // Mock the userService to return a non-admin user
    const regularUser = createMockMongooseDoc({
      id: "user_id",
      role: RoleEnum.USER,
    });

    // (userService.findUserById as jest.Mock).mockResolvedValue(regularUser);
    (userService.findUserById as jest.Mock<any>).mockResolvedValue(regularUser);

    const res = await request(app)
      .delete("/api/v1/tasks/123")
      .set("Authorization", generateTestToken());

    expect(res.status).toBe(403);
    expect(res.body.message).toBe("Forbidden");
  });

  it("should return 404 if task not found", async () => {
    // Mock the userService to return an admin user
    const adminUser = createMockMongooseDoc({
      id: "admin_id",
      role: RoleEnum.ADMIN,
    });

    // (userService.findUserById as jest.Mock).mockResolvedValue(adminUser);
    (userService.findUserById as jest.Mock<any>).mockResolvedValue(adminUser);

    mockingoose(Task).toReturn(null, "findOneAndDelete");

    const res = await request(app)
      .delete("/api/v1/tasks/999")
      .set("Authorization", generateTestToken());

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Task not found");
  });

  it("should return 401 if user is not authenticated", async () => {
    // Mock the userService to return null (user not found)
    (userService.findUserById as jest.Mock<any>).mockResolvedValue(null);

    const res = await request(app)
      .delete("/api/v1/tasks/123")
      .set("Authorization", generateTestToken());

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Unauthorized");
  });

  it("should update a task successfully", async () => {
    const updatedTask = {
      id: "123",
      title: "Updated Task",
      status: "inProgress",
    };

    mockingoose(Task).toReturn(updatedTask, "findOneAndUpdate");

    const res = await request(app)
      .put("/api/v1/tasks/123")
      .send({ title: "Updated Task", status: "inProgress" })
      .set("Authorization", generateTestToken());

    expect(res.status).toBe(200);
    expect(res.body.data.title).toBe("Updated Task");
    expect(res.body.data.status).toBe("inProgress");
  });

  it("should get a single task by id", async () => {
    mockingoose(Task).toReturn(mockTask, "findOne");

    const res = await request(app)
      .get("/api/v1/tasks/123")
      .set("Authorization", generateTestToken());

    expect(res.status).toBe(200);
    expect(res.body.data.title).toBe("New Task");
  });
});
