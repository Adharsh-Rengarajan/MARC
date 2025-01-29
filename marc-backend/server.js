import dotenv from "dotenv";
import express from "express";
import initialise from "./service/app.js";
import { seedUsers } from "./seedFile.js";
import mongoose from "mongoose";

dotenv.config();
const app = express();
const port = process.env.PORT;

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_CONNECTION);
    console.log("Connected to MongoDB2");

    await seedUsers();
    initialise(app);

    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  } catch (error) {
    console.error("Error initializing server:", error);
  }
};

startServer();
