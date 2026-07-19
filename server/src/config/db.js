import mongoose from "mongoose";

export async function connectDB() {
  const uri = process.env.MONGO_URI || "mongodb://localhost:27017/argus";
  await mongoose.connect(uri);
  console.log(`[db] connected -> ${uri}`);
}
