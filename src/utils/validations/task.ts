import { z } from "zod";
import { PriorityEnum, StatusEnum } from "../../types";

export const createTaskSchema = z.object({
  title: z.string().min(1, "Title must be at least 1 character").trim(),
  description: z.string().trim().optional(),
  status: z
    .enum([StatusEnum.NOT_STARTED, StatusEnum.IN_PROGRESS, StatusEnum.DONE])
    .default(StatusEnum.NOT_STARTED),
  priority: z
    .enum([PriorityEnum.HIGH, PriorityEnum.MEDIUM, PriorityEnum.LOW])
    .default(PriorityEnum.LOW),
  dueDate: z.string().date().optional(),
  assignedTo: z.string().optional(),
  projectId: z.string().optional(),
});

export const updateTaskSchema = z.object({
  title: z
    .string()
    .min(1, "Title must be at least 1 character")
    .trim()
    .optional(),
  description: z.string().trim().optional(),
  status: z
    .enum([StatusEnum.NOT_STARTED, StatusEnum.IN_PROGRESS, StatusEnum.DONE])
    .default(StatusEnum.NOT_STARTED)
    .optional(),
  priority: z
    .enum([PriorityEnum.HIGH, PriorityEnum.MEDIUM, PriorityEnum.LOW])
    .default(PriorityEnum.LOW),
  dueDate: z.string().date().optional(),
  assignedTo: z.string().optional(),
  projectId: z.string().optional(),
});
