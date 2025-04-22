import { Types } from "mongoose";

export interface ITask {
  title: string;
  description?: string;
  status?: StatusEnum;
  dueDate?: Date | string;
  assignedTo?: Types.ObjectId | string;
}
export interface ITaskDocument extends Document, ITask {}

export enum StatusEnum {
  NOT_STARTED = "notStarted",
  IN_PROGRESS = "inProgress",
  DONE = "done",
}

export type IUpdateTask = Partial<Pick<ITask, keyof ITask>>;
