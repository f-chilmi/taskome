import request from "supertest";
import app from "../../src/app";
import { User } from "../../src/models";
import { HashingService, JwtService } from "../../src/services";
import {
  afterAll,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";
import mongoose from "mongoose";

const mockingoose = require("mockingoose");

describe("Auth routes", () => {
  beforeEach(() => {
    mockingoose.resetAll();
    jest.restoreAllMocks();
  });

  it("should register a new user", async () => {
    const mockUser = {
      name: "Jane Doe",
      email: "jane@example.com",
      role: "admin",
    };

    mockingoose(User).toReturn(null, "findOne");
    mockingoose(User).toReturn(mockUser, "save");

    jest.spyOn(JwtService, "generateTokens").mockReturnValue({
      accessToken: "mockAccessToken",
    });

    const res = await request(app).post("/api/v1/auth/register").send({
      name: "Jane Doe",
      email: "jane@example.com",
      password: "securePass123.",
    });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("Registered successfully");
    expect(res.body.data.email).toBe("jane@example.com");
    expect(res.body.tokens).toEqual({ accessToken: "mockAccessToken" });
  });

  it("should login an existing user", async () => {
    const password = "securePass123.";
    const hashed = await HashingService.hash(password);

    const mockUser = {
      email: "john@example.com",
      password: hashed,
      role: "admin",
    };

    mockingoose(User).toReturn(mockUser, "findOne");

    jest.spyOn(JwtService, "generateTokens").mockReturnValue({
      accessToken: "mockAccessToken",
    });

    const res = await request(app).post("/api/v1/auth/login").send({
      email: "john@example.com",
      password,
    });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Logged in successfully");
    expect(res.body.tokens).toBe("mockAccessToken");
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });
});
