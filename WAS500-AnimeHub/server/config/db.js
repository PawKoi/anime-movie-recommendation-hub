import mongoose from "mongoose";

export async function connectDB(mongoUri) {
  if (!mongoUri) {
    console.error("MONGODB_URI is not set");
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
}
