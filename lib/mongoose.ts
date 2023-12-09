import mongoose from "mongoose";

let isConnected = false;

export const connectToDB = async () => {
  mongoose.set("strictQuery", true);
  if (!process.env.MONGODB_URL) return console.error("mongo_db url not found");
  if (isConnected) return console.log("Already connected to mongo_db");
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    isConnected = true;
    console.log("Connected to mongo_db");
  } catch (error: any) {
    console.error("Error connecting to mongo_db", error);
    throw new Error(`Failed to connect to mongo_db!`);
  }
};
