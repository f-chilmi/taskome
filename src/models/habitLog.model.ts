import { Schema, model } from "mongoose";
import { IHabitLogDocument } from "../types";

const habitLogSchema = new Schema<IHabitLogDocument>(
  {
    isChecked: { type: Boolean, required: true },
    date: { type: Date, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    habitId: { type: Schema.Types.ObjectId, ref: "Habit", required: true },
  },
  { timestamps: true }
);

const HabitLog = model<IHabitLogDocument>("HabitLog", habitLogSchema);
export { HabitLog };
