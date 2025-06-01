import { Types } from "mongoose";

export interface IEvent {
  _id?: Types.ObjectId | string;
  userId: Types.ObjectId | string;
  name: string;
  color: string;
  disabledHabitIds: Types.ObjectId[] | string[];
  dates: Date[];
  note?: string;
}
export interface IEventDocument extends Document, IEvent {}

export type IUpdateEvent = Partial<Pick<IEvent, keyof IEvent>>;
