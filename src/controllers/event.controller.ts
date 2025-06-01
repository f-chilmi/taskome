import asyncHandler from "express-async-handler";
import { eventService, PaginationService } from "../services";
import { CREATED, createEventSchema, logger, OK } from "../utils";
import { Types } from "mongoose";
import { IPaginationQuery } from "../types";
import { format } from "date-fns";

function transformDateRange(startDate: Date, endDate: Date) {
  const dateList: Date[] = [];

  // Ambil tanggal tanpa jam (UTC midnight)
  const start = new Date(
    Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate())
  );
  const end = new Date(
    Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate())
  );

  for (
    let dt = start.getTime();
    dt <= end.getTime();
    dt += 24 * 60 * 60 * 1000
  ) {
    dateList.push(new Date(dt));
  }

  return dateList;
}

export const createEvent = asyncHandler(async (req, res) => {
  console.log(req.body);
  const payload = createEventSchema.parse(req.body);

  const userId = new Types.ObjectId(payload.userId ?? req.user?.id);
  const eventInfo = await eventService.createOrUpdateOne(
    { userId, _id: payload._id },
    {
      ...payload,
      userId,
      dates: transformDateRange(payload.startDate, payload.endDate),
    }
  );

  logger.info(eventInfo);

  res.status(CREATED).json({
    message: "Event created successfully",
    data: eventInfo,
  });
});

export const getEvents = asyncHandler(async (req, res) => {
  const {
    pageNumber = 1,
    pageSize = 1000,
    date,
  } = req.query as unknown as IPaginationQuery & {
    date: string | Date;
  };

  const query: any = {
    userId: new Types.ObjectId(req.user?.id),
  };

  const { skip, take } = PaginationService.getPagination({
    pageNumber,
    pageSize,
  });

  const [events] = await Promise.all([
    eventService.findAll(
      query,
      parseInt(skip.toString()),
      parseInt(take.toString())
    ),
  ]);

  const logs: Record<number, any> = {};
  const targetMonth = new Date(date).getMonth() + 1;
  const targetYear = new Date(date).getFullYear();

  // events.forEach((event) => {
  //   event.instances?.forEach((instance) => {
  //     const [year, month] = instance.month.split("-").map(Number);
  //     if (year === targetYear && month === targetMonth) {
  //       instance.dates.forEach((date) => {
  //         logs[date] = logs[date] ? logs[date] : event;
  //       });
  //     }
  //   });
  // });

  res.status(OK).json({
    message: "Event list",
    data: events,
    logs,
  });
});
export const getEventByDate = asyncHandler(async (req, res) => {
  const { date } = req.params as {
    date: string;
  };

  const selectedDate = new Date(date);

  const query: any = {
    userId: new Types.ObjectId(req.user?.id),
    "instances.month": format(selectedDate, "yyyy-MM"),
    "instances.dates": selectedDate.getDate(),
  };

  const [events] = await Promise.all([
    eventService.findAll(query, parseInt("0"), parseInt("10000")),
  ]);

  const logs: Record<number, any> = {};
  const targetMonth = new Date(date).getMonth() + 1;
  const targetYear = new Date(date).getFullYear();

  // events.forEach((event) => {
  //   event.instances?.forEach((instance) => {
  //     const [year, month] = instance.month.split("-").map(Number);
  //     if (year === targetYear && month === targetMonth) {
  //       instance.dates.forEach((date) => {
  //         logs[date] = logs[date] ? logs[date] : event;
  //       });
  //     }
  //   });
  // });

  res.status(OK).json({
    message: "Event list",

    logs: logs[selectedDate.getDate()],
  });
});
