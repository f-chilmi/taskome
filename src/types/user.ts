import { Types } from "mongoose";

export interface IUser {
  id?: Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  role: RoleEnum;
}
export interface IUserDocument extends Document, IUser {}

export enum RoleEnum {
  USER = "user",
  ADMIN = "admin",
}
