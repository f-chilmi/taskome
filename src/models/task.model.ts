import { Schema, model } from "mongoose";
import { StatusEnum, ITaskDocument, PriorityEnum } from "../types";

const taskSchema = new Schema<ITaskDocument>(
  {
    title: { type: String, required: [true, "title is required"] },
    description: { type: String },
    status: {
      type: String,
      enum: [StatusEnum.NOT_STARTED, StatusEnum.IN_PROGRESS, StatusEnum.DONE],
      default: StatusEnum.NOT_STARTED,
    },
    priority: {
      type: String,
      enum: [PriorityEnum.HIGH, PriorityEnum.MEDIUM, PriorityEnum.LOW],
      default: PriorityEnum.LOW,
    },
    dueDate: { type: Date },
    assignedTo: { type: Schema.Types.ObjectId, ref: "User", required: false },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: false,
    },
  },
  { timestamps: true }
);

const Task = model<ITaskDocument>("Task", taskSchema);
export { Task };
