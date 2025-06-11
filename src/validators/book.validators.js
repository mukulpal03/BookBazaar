import { z } from "zod";
import { AvailableBooksGenre } from "../utils/constant.util.js"; // Adjust path as needed

export const bookValidationSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  author: z.string().trim().min(1, "Author is required"),
  genre: z.enum(AvailableBooksGenre, {
    errorMap: () => ({ message: "Invalid genre" }),
  }),
  isbn: z.string().trim().min(1, "ISBN is required"),
  price: z.number({ required_error: "Price is required" }),
  stock: z.number().default(0),
  description: z.string().trim().optional(),
  publisher: z.string().trim().optional(),
});
