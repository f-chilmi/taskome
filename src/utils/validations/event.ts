import { z } from "zod";

export const createEventSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(1, "Name must be at least 1 character").trim(),
  color: z.string().min(1, "Color is required"),
  disabledHabitIds: z.array(z.string()).optional().default([]),
  note: z.string().trim().optional(),
  userId: z.string().optional(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
});
