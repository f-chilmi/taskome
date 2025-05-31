import { Types } from "mongoose";

export interface IHabitLog {
  userId: Types.ObjectId | string;
  habitId: Types.ObjectId | string;
  date: Date | string;
  isChecked: boolean;
}

export interface IHabitLogDocument extends Document, IHabitLog {}
