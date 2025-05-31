import { Schema, model } from "mongoose";
import { IHabitDocument, RepetitionEnum } from "../types";

const habitSchema = new Schema<IHabitDocument>(
  {
    name: { type: String, required: [true, "name is required"] },
    description: { type: String },
    repeat: {
      type: String,
      enum: [
        RepetitionEnum.DAILY,
        RepetitionEnum.MONTHLY,
        RepetitionEnum.WEEKLY,
        RepetitionEnum.CUSTOM,
      ],
      default: RepetitionEnum.DAILY,
    },

    startDate: { type: Date },
    endDate: { type: Date },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: false },
  },
  { timestamps: true }
);

const Habit = model<IHabitDocument>("Habit", habitSchema);
export { Habit };
