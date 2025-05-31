import { Types } from "mongoose";
import { Habit, HabitLog } from "../models";
import { IHabitLog, IUpdateHabit } from "../types";

export class HabitLogService {
  constructor(private readonly habitLogDataSource = HabitLog) {}

  async createOne(data: IHabitLog) {
    return this.habitLogDataSource.create(data);
  }

  async updateOrCreateOne(data: IHabitLog) {
    return this.habitLogDataSource.updateOne(
      { habitId: data.habitId, userId: data.userId, date: data.date },
      { $set: data },
      { runValidators: true, upsert: true }
    );
  }

  async delete(params: { [key: string]: string }) {
    return this.habitLogDataSource.deleteMany(params);
  }
  async deleteOne(id: string) {
    return this.habitLogDataSource.deleteOne({ _id: new Types.ObjectId(id) });
  }

  async updateOne(id: string, data: IUpdateHabit) {
    return this.habitLogDataSource.updateOne(
      { _id: new Types.ObjectId(id) },
      data,
      { runValidators: true }
    );
  }

  async findById(id: string) {
    return this.habitLogDataSource
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
    return this.habitLogDataSource
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
      sortStage[sortBy || "dueDate"] = sortOrder === "desc" ? -1 : 1;
    }

    return this.habitLogDataSource.aggregate([
      {
        $match: query,
      },
      // {
      //   $addFields: {
      //     priorityValue: {
      //       $switch: {
      //         branches: [
      //           { case: { $eq: ["$priority", "high"] }, then: 1 },
      //           { case: { $eq: ["$priority", "medium"] }, then: 2 },
      //           { case: { $eq: ["$priority", "low"] }, then: 3 },
      //         ],
      //         default: 4,
      //       },
      //     },
      //   },
      // },
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
    return this.habitLogDataSource.countDocuments(query).exec();
  }
}

export const habitLogService = new HabitLogService();
