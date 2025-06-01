import { Schema, model } from "mongoose";
import { IEventDocument } from "../types";

const eventSchema = new Schema<IEventDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: [true, "name is required"] },
    color: { type: String, required: [true, "color is required"] },
    disabledHabitIds: {
      type: [Schema.Types.ObjectId],
      ref: "Habit",
      required: false,
      default: [],
    },
    note: { type: String, required: false },
    dates: { type: [Date], required: true },
  },
  { timestamps: true }
);

const Event = model<IEventDocument>("Event", eventSchema);
export { Event };
