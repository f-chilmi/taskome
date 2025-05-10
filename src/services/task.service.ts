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
    return this.taskDataSource
      .findById(id)
      .populate("assignedTo", "-password")
      .populate("projectId");
  }

  async findAll(
    query?: any,
    skip: number = 0,
    limit: number = 1000,
    sort = {}
  ) {
    return this.taskDataSource
      .find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate("assignedTo", "-password")
      .populate("projectId")
      .exec();
  }
  async aggregateAll(
    query: any = {},
    skip = 0,
    limit = 1000,
    sortBy?: string,
    sortOrder?: "asc" | "desc"
  ) {
    const sortStage: any = {};

    if (sortBy === "priority") {
      sortStage["priorityValue"] = sortOrder === "desc" ? 1 : -1;
    } else {
      sortStage[sortBy || "createdAt"] = sortOrder === "desc" ? -1 : 1;
    }

    return this.taskDataSource.aggregate([
      {
        $match: query,
      },
      {
        $addFields: {
          priorityValue: {
            $switch: {
              branches: [
                { case: { $eq: ["$priority", "high"] }, then: 1 },
                { case: { $eq: ["$priority", "medium"] }, then: 2 },
                { case: { $eq: ["$priority", "low"] }, then: 3 },
              ],
              default: 4,
            },
          },
        },
      },
      { $sort: sortStage },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: "users",
          localField: "assignedTo",
          foreignField: "_id",
          as: "userAssigned",
        },
      },
      {
        $unwind: {
          path: "$userAssigned",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "projects",
          localField: "projectId",
          foreignField: "_id",
          as: "project",
        },
      },
      {
        $unwind: {
          path: "$project",
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);
  }
  async countAll(query?: any) {
    return this.taskDataSource.countDocuments(query).exec();
  }
}

export const taskService = new TaskService();
