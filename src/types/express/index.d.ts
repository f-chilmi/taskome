import { JwtPayload } from "jsonwebtoken";
import { RoleEnum } from "../user";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
      };
    }
  }
}
