import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;
if (!MONGODB_URI) {
  throw new Error("Please define mongodb uri in env file");
}

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  // if already having connection
  if (cached.conn) {
    return cached.conn;
  }
  // if we dont have promise in cashed then do connection
  if (!cached.promise) {
    const opts = {
      bufferCommands: true,
      maxPoolSize: 10, //how many connection can be possible with db that is define we are getting 10
    };
    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then(() => mongoose.connection);
  }

  try {
    // if already connetion then return the promise
    cached.conn = await cached.promise;
  } catch (error) {
    // otherwise prmoise ko null kardo
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}
