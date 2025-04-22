import { Schema, model } from "mongoose";
import { ITokenDocument } from "../types";

const tokenSchema = new Schema<ITokenDocument>({
  token: { type: String, required: [true, "Token is required"] },

  userId: { type: Schema.Types.ObjectId, ref: "User" },
  expiresAt: { type: Date, required: [true, "Expires at is required"] },
});

const Token = model<ITokenDocument>("Token", tokenSchema);
export { Token };
