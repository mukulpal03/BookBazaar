import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/user.routes.js";
import bookRoutes from "./routes/book.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import cartRoutes from "./routes/cart.routes.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/books", bookRoutes);
app.use("/api/v1/books/:bookId/reviews", reviewRoutes);
app.use("/api/v1/cart", cartRoutes);

app.use((err, _req, res, _next) => {
  const statusCode = err.statusCode ?? 500;

  return res.status(statusCode).json({
    message: err.message ?? "Internal server error",
    errors: err.errors ?? [],
    success: err.success ?? false,
  });
});

export default app;
