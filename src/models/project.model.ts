import { Schema, model } from "mongoose";
import { IProjectDocument } from "../types/project";

const projectSchema = new Schema<IProjectDocument>(
  {
    name: { type: String, required: [true, "name is required"] },
    description: { type: String },
  },
  { timestamps: true }
);

const Project = model<IProjectDocument>("Project", projectSchema);
export { Project };
