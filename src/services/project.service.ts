import { Types } from "mongoose";
import { Project } from "../models";
import { IProject, IUpdateProject } from "../types";

export class ProjectService {
  constructor(private readonly projectDataSource = Project) {}

  async createOne(data: IProject) {
    return this.projectDataSource.create(data);
  }

  async deleteOne(id: string) {
    return this.projectDataSource.deleteOne({ _id: new Types.ObjectId(id) });
  }

  async updateOne(id: string, data: IUpdateProject) {
    return this.projectDataSource.updateOne(
      { _id: new Types.ObjectId(id) },
      data,
      { runValidators: true }
    );
  }

  async findById(id: string) {
    return this.projectDataSource.findById(id);
  }

  async findAll(query?: any, skip: number = 0, limit: number = 1000) {
    return this.projectDataSource.find(query).skip(skip).limit(limit).exec();
  }
  async countAll(query?: any) {
    return this.projectDataSource.countDocuments(query).exec();
  }
}

export const projectService = new ProjectService();
