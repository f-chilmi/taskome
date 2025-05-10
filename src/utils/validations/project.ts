import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 character").trim(),
  description: z.string().trim().optional(),
});
