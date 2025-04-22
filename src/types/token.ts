import { Types } from "mongoose";

export interface IToken {
  token: string;
  userId: Types.ObjectId;
  expiresAt: Date;
}
export interface ITokenDocument extends Document, IToken {}
