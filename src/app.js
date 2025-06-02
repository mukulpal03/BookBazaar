import express from "express";
import authRoutes from "./routes/user.routes.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth", authRoutes);

app.use((err, _req, res, _next) => {
  const statusCode = err.statusCode ?? 500;

  return res.status(statusCode).json({
    message: err.message ?? "Internal server error",
    errors: err.errors ?? [],
    success: err.success ?? false,
  });
});

export default app;
