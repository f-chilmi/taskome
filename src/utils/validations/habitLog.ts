import { z } from "zod";

export const createHabitLogSchema = z.object({
  habitId: z.string(),
  isChecked: z.boolean(),
  date: z.string().date(),
});
