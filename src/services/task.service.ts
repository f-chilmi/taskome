import { Types } from "mongoose";
import { Task } from "../models";
import { ITask, IUpdateTask } from "../types";

export class TaskService {
  constructor(private readonly taskDataSource = Task) {}

  async createOne(data: ITask) {
    return this.taskDataSource.create(data);
  }

  async deleteOne(id: string) {
    return this.taskDataSource.deleteOne({ _id: new Types.ObjectId(id) });
  }

  async updateOne(id: string, data: IUpdateTask) {
    return this.taskDataSource.updateOne(
      { _id: new Types.ObjectId(id) },
      data,
      { runValidators: true }
    );
  }

  async findById(id: string) {
    return this.taskDataSource.findById(id);
  }

  async findAll(query?: any, skip: number = 0, limit: number = 1000) {
    return this.taskDataSource.find(query).skip(skip).limit(limit).exec();
  }
  async countAll(query?: any) {
    return this.taskDataSource.countDocuments(query).exec();
  }
}

export const taskService = new TaskService();
