import { z } from "zod";

const registerUserSchema = z.object({
  username: z
    .string()
    .trim()
    .min(2, { message: "Username should be atleast 2 characters" })
    .max(20, { message: "Username cannot exceed 20 characters" }),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password should be at least 6 characters" }),
});

const loginUserSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" }),

  password: z.string().min(1, { message: "Password is required" }),
});

export { registerUserSchema, loginUserSchema };
