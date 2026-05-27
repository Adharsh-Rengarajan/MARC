import dotenv from "dotenv";
dotenv.config();

import { createApp } from "./src/app.js";
import { connectDB } from "./src/config/db.js";
import { seedUsers } from "./src/seed.js";

const PORT = parseInt(process.env.PORT || "9000", 10);

const requiredEnv = ["MONGO_CONNECTION", "JWT_SECRET"];
const missing = requiredEnv.filter((k) => !process.env[k]);
if (missing.length) {
  console.error(`Missing required env vars: ${missing.join(", ")}`);
  process.exit(1);
}

const start = async () => {
  try {
    await connectDB();
    if (process.env.SEED_ON_START === "true") {
      await seedUsers();
    }
    const app = createApp();
    app.listen(PORT, () => {
      console.log(`MARC backend listening on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};

process.on("unhandledRejection", (err) => {
  console.error("Unhandled rejection:", err);
});
process.on("uncaughtException", (err) => {
  console.error("Uncaught exception:", err);
  process.exit(1);
});

start();
