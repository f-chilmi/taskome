import { HashingService, JwtService, tokenService, userService } from ".";
import { IAuth, IUser } from "../types";
import {
  ApiError,
  CONFLICT,
  logger,
  MAGIC_NUMBERS,
  UNAUTHORIZED,
} from "../utils";
import { Types } from "mongoose";

export class AuthService {
  protected async generateAndStoreTokens(userId: string) {
    const tokens = JwtService.generateTokens(userId);
    const objectIdUserId = new Types.ObjectId(userId);
    await tokenService.createOne({
      token: tokens.accessToken,
      userId: objectIdUserId,
      expiresAt: new Date(Date.now() + MAGIC_NUMBERS.ONE_WEEK_IN_MILLISECONDS),
    });

    return tokens;
  }

  protected formatUserResponse(user: IUser): IUser {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }

  async register(userRegistrationInfo: IUser) {
    try {
      const userExists = await userService.findUserByEmail(
        userRegistrationInfo.email
      );

      if (userExists) {
        throw new ApiError("User already exists", CONFLICT);
      }

      const hashedPassword = await HashingService.hash(
        userRegistrationInfo.password!
      );
      const userCredentials = {
        ...userRegistrationInfo,
        password: hashedPassword,
      };

      const user = await userService.createOne(userCredentials);
      const tokens = await this.generateAndStoreTokens(user.id);

      return { data: user, tokens };
    } catch (error) {
      logger.error("Registration failed:", error);
      throw error;
    }
  }

  async login(userLoginInfo: IAuth) {
    try {
      const user = await userService.findUserByEmail(userLoginInfo.email);

      if (!user || !user.password) {
        throw new ApiError("Invalid email or password", UNAUTHORIZED);
      }

      const passwordMatches = await HashingService.compare(
        userLoginInfo.password,
        user.password
      );

      if (!passwordMatches) {
        throw new ApiError("Invalid email or password", UNAUTHORIZED);
      }

      const tokens = await this.generateAndStoreTokens(user.id);

      return { data: user, tokens: tokens.accessToken };
    } catch (error) {
      logger.error("Login failed:", error);
      throw error;
    }
  }

  async logout(token: string) {
    try {
      const storedToken = await tokenService.tokenExists(token);

      if (!storedToken) {
        throw new ApiError("Unauthorized", UNAUTHORIZED);
      }

      await tokenService.deleteOne(token);
    } catch (error) {
      logger.error("Logout failed:", error);
      throw error;
    }
  }
}

export const authService = new AuthService();
