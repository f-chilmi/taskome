import { Token } from "../models";
import { IToken } from "../types";
import { ApiError, UNAUTHORIZED } from "../utils";

export class TokenService {
  constructor(private readonly tokenDataSource = Token) {}

  async createOne(data: IToken) {
    return this.tokenDataSource.create(data);
  }

  async deleteOne(token: string) {
    return this.tokenDataSource.deleteOne({ token });
  }

  async tokenExists(token: string) {
    const now = new Date();

    const existingToken = await this.tokenDataSource.findOne({
      token,
      expiresAt: { $gt: now },
    });

    if (!existingToken) {
      throw new ApiError("Invalid or expired token", UNAUTHORIZED);
    }

    return token;
  }
}

export const tokenService = new TokenService();
