import mongoose from "mongoose";

export const connectDB = async () => {
  const uri = process.env.MONGO_CONNECTION;
  if (!uri) {
    throw new Error("MONGO_CONNECTION is not set in environment");
  }
  await mongoose.connect(uri);
  console.log("MongoDB connected");
};

export const disconnectDB = async () => {
  await mongoose.disconnect();
};
