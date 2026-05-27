import express from "express";
import cors from "cors";
import { mountRoutes } from "./routes/index.js";
import { notFound, errorHandler } from "./utils/errors.js";

export const createApp = () => {
  const app = express();

  const corsOptions = {
    origin: process.env.CLIENT_URL ? process.env.CLIENT_URL.split(",") : true,
    credentials: true,
  };
  app.use(cors(corsOptions));
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true }));

  app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok", uptime: process.uptime() });
  });

  mountRoutes(app);

  app.use(notFound);
  app.use(errorHandler);

  return app;
};
