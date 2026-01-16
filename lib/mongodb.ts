import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "";

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined in environment variables");
}

// Extend the global namespace to include mongoose cache with proper types
declare global {
  var mongoose: {
    connection: any;
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

// Bind global.mongoose as cache object
const globalMongoose = global as unknown as {
  mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
};

if (!globalMongoose.mongoose) {
  globalMongoose.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (globalMongoose.mongoose.conn) {
    return globalMongoose.mongoose.conn;
  }

  if (!globalMongoose.mongoose.promise) {
    globalMongoose.mongoose.promise = mongoose
      .connect(MONGODB_URI)
      .then((m) => m);
  }
  globalMongoose.mongoose.conn = await globalMongoose.mongoose.promise;
  return globalMongoose.mongoose.conn;
}

export default connectDB;
