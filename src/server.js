import app from "./app.js";
import { config } from "./config/env.js";
import connectDB from "./lib/db.js";

connectDB().then(() =>
  app.listen(config.port, () =>
    console.log(`Listening on port ${config.port}`),
  ),
);
