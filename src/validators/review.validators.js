import { z } from "zod";

export const reviewValidationSchema = z.object({
  rating: z
    .number()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating must be at most 5")
    .default(1),
  content: z.string().min(1, "Review content is required"),
});
