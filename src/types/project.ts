import { Types } from "mongoose";

export interface IProject {
  name: string;
  description?: string;
}
export interface IProjectDocument extends Document, IProject {}

export type IUpdateProject = Partial<Pick<IProject, keyof IProject>>;
