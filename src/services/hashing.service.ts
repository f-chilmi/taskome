import { compare, hash } from "bcryptjs";
import { bcryptSaltRounds } from "../config";
import { ApiError, BAD_REQUEST } from "../utils";

export class HashingService {
  static async hash(text: string): Promise<string> {
    if (!text) {
      throw new ApiError("Missing information to hash", BAD_REQUEST);
    }
    return await hash(text, Number(bcryptSaltRounds));
  }
  static compare(text: string, hashedText: string): Promise<boolean> {
    if (!text || !hashedText) {
      throw new ApiError("Missing information to compare", BAD_REQUEST);
    }
    return compare(text, hashedText);
  }
}
