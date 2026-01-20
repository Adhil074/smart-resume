// smart-resume/lib/mongodb.ts

import mongoose, { Mongoose } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "";

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined in environment variables");
}

// extends the global namespace safely
declare global {
  var mongoose:
    | {
        conn: Mongoose | null;
        promise: Promise<Mongoose> | null;
      }
    | undefined;
}

const globalMongoose = globalThis as typeof globalThis & {
  mongoose?: {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
  };
};

if (!globalMongoose.mongoose) {
  globalMongoose.mongoose = { conn: null, promise: null };
}

async function connectDB(): Promise<Mongoose> {
  if (globalMongoose.mongoose!.conn) {
    return globalMongoose.mongoose!.conn;
  }

  if (!globalMongoose.mongoose!.promise) {
    globalMongoose.mongoose!.promise = mongoose.connect(MONGODB_URI);
  }

  globalMongoose.mongoose!.conn = await globalMongoose.mongoose!.promise;
  return globalMongoose.mongoose!.conn;
}

export default connectDB;
