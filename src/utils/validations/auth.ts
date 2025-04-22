import { z } from "zod";
import { RoleEnum } from "../../types";

export const registerSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").trim(),
  email: z.string().email("Invalid email format").toLowerCase().trim(),
  password: z
    .string()
    .regex(
      /^(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>])(?=.*[A-Za-z]).{8,}$/,
      "Password: 8+ chars, 1 number, 1 special, 1 lowercase or uppercase"
    )
    .trim(),
  role: z.enum([RoleEnum.ADMIN, RoleEnum.USER]).default(RoleEnum.USER),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email format").toLowerCase().trim(),
  password: z.string().trim(),
});
