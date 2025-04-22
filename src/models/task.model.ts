import { Schema, model } from "mongoose";
import { StatusEnum, ITaskDocument } from "../types";

const taskSchema = new Schema<ITaskDocument>(
  {
    title: { type: String, required: [true, "title is required"] },
    description: { type: String },
    status: {
      type: String,
      enum: [StatusEnum.NOT_STARTED, StatusEnum.IN_PROGRESS, StatusEnum.DONE],
      default: StatusEnum.NOT_STARTED,
    },
    dueDate: { type: Date },
    assignedTo: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Task = model<ITaskDocument>("task", taskSchema);
export { Task };
