import { Types } from "mongoose";
import { IUser, IProject } from ".";

export interface ITask {
  title: string;
  description?: string;
  status?: StatusEnum;
  priority?: PriorityEnum;
  dueDate?: Date | string;
  assignedTo?: Types.ObjectId | string;
  projectId?: Types.ObjectId | string;

  userAssigned?: IUser;
  project?: IProject;
}
export interface ITaskDocument extends Document, ITask {}

export enum StatusEnum {
  NOT_STARTED = "Not Started",
  IN_PROGRESS = "In Progress",
  DONE = "Done",
}

export enum PriorityEnum {
  HIGH = "High",
  MEDIUM = "Medium",
  LOW = "Low",
}

export type IUpdateTask = Partial<Pick<ITask, keyof ITask>>;
