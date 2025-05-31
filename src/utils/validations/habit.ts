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

// export const updateTaskSchema = z.object({
//   title: z
//     .string()
//     .min(1, "Title must be at least 1 character")
//     .trim()
//     .optional(),
//   description: z.string().trim().optional(),
//   status: z
//     .enum([StatusEnum.NOT_STARTED, StatusEnum.IN_PROGRESS, StatusEnum.DONE])
//     .default(StatusEnum.NOT_STARTED)
//     .optional(),
//   priority: z
//     .enum([PriorityEnum.HIGH, PriorityEnum.MEDIUM, PriorityEnum.LOW])
//     .default(PriorityEnum.LOW),
//   dueDate: z.string().date().optional(),
//   assignedTo: z.string().optional(),
//   projectId: z.string().optional(),
// });
