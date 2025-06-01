import { Types } from "mongoose";
import { Event } from "../models";
import { IEvent, IUpdateEvent } from "../types";

export class EventService {
  constructor(private readonly eventDataSource = Event) {}

  async createOne(data: IEvent) {
    return this.eventDataSource.create(data);
  }

  async createOrUpdateOne(filter: Partial<IEvent>, data: IEvent) {
    return this.eventDataSource.findOneAndUpdate(filter, data, {
      upsert: true,
      new: true,
    });
  }

  async deleteOne(id: string) {
    return this.eventDataSource.deleteOne({ _id: new Types.ObjectId(id) });
  }

  async updateOne(id: string, data: IUpdateEvent) {
    return this.eventDataSource.updateOne(
      { _id: new Types.ObjectId(id) },
      data,
      { runValidators: true }
    );
  }

  async findById(id: string) {
    return this.eventDataSource
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
    return (
      this.eventDataSource
        .find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        // .populate("disabledHabitIds")
        .exec()
    );
  }

  async countAll(query?: any) {
    return this.eventDataSource.countDocuments(query).exec();
  }
}

export const eventService = new EventService();
