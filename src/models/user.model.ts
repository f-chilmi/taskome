import { Schema, model } from "mongoose";
import { IUserDocument, RoleEnum } from "../types";

const userSchema = new Schema<IUserDocument>(
  {
    name: { type: String, required: [true, "Name is required"] },
    email: { type: String, required: [true, "Email is required"] },
    password: { type: String, required: [true, "Password is required"] },
    role: {
      type: String,
      enum: [RoleEnum.USER, RoleEnum.ADMIN],
      default: RoleEnum.USER,
    },
  },
  { timestamps: true }
);

const User = model<IUserDocument>("User", userSchema);
export { User };
