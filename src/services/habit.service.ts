import { Types } from "mongoose";
import { Habit } from "../models";
import { IHabit, IUpdateHabit } from "../types";
import { endOfDay, endOfMonth, startOfMonth } from "date-fns";

export class HabitService {
  constructor(private readonly habitDataSource = Habit) {}

  async createOne(data: IHabit) {
    return this.habitDataSource.create(data);
  }

  async deleteOne(id: string) {
    return this.habitDataSource.deleteOne({ _id: new Types.ObjectId(id) });
  }

  async updateOne(id: string, data: IUpdateHabit) {
    return this.habitDataSource.updateOne(
      { _id: new Types.ObjectId(id) },
      data,
      { runValidators: true }
    );
  }

  async findById(id: string) {
    return this.habitDataSource
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
    return this.habitDataSource
      .find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate("assignedTo", "-password")
      .populate("projectId")
      .exec();
  }
  async aggregateAll(query: any = {}, skip = 0, limit = 1000, date: string) {
    const filterDate = new Date(date);

    return this.habitDataSource.aggregate([
      {
        $match: query,
      },

      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: "habitlogs",
          let: { habitId: "$_id", userId: "$userId" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$habitId", "$$habitId"] },
                    { $eq: ["$userId", "$$userId"] },
                  ],
                },
                updatedAt: {
                  $gte: startOfMonth(filterDate),
                  $lte: endOfMonth(filterDate),
                },
              },
            },
            { $sort: { date: 1 } },
            {
              $project: {
                _id: 0,
                date: 1,
                isChecked: 1,
              },
            },
          ],
          as: "habitLogs",
        },
      },
      {
        $addFields: {
          habitLogs: {
            $arrayToObject: {
              $map: {
                input: "$habitLogs",
                as: "log",
                in: {
                  k: { $toString: { $dayOfMonth: "$$log.date" } },
                  v: "$$log.isChecked",
                },
              },
            },
          },
        },
      },
    ]);
  }
  async countAll(query?: any) {
    return this.habitDataSource.countDocuments(query).exec();
  }
}

export const habitService = new HabitService();
