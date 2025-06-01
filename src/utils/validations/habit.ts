import { z } from "zod";
import { RepetitionEnum } from "../../types";

export const createHabitSchema = z.object({
  name: z.string().min(1, "Name must be at least 1 character").trim(),
  description: z.string().trim().optional(),
  repeat: z
    .enum([
      RepetitionEnum.DAILY,
      RepetitionEnum.WEEKLY,
      RepetitionEnum.MONTHLY,
      RepetitionEnum.CUSTOM,
    ])
    .default(RepetitionEnum.DAILY),
  startDate: z.string().date().optional(),
  endDate: z.string().date().optional(),
  userId: z.string().optional(),
});
