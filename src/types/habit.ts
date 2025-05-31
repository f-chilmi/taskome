import { Types } from "mongoose";

export interface IHabit {
  userId: Types.ObjectId | string;
  name: string;
  description?: string;
  repeat: RepetitionEnum;
  startDate?: Date | string;
  endDate?: Date | string;
}
export interface IHabitDocument extends Document, IHabit {}

export enum RepetitionEnum {
  DAILY = "Daily",
  WEEKLY = "Weekly",
  MONTHLY = "Monthly",
  CUSTOM = "Custom",
}

export type IUpdateHabit = Partial<Pick<IHabit, keyof IHabit>>;
