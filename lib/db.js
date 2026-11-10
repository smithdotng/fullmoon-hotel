import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fullmoonhotel';

// Reuse one connection across hot reloads and serverless invocations.
let cached = globalThis.__fmMongoose;
if (!cached) cached = globalThis.__fmMongoose = { conn: null, promise: null };

export default async function dbConnect() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, { bufferCommands: false, serverSelectionTimeoutMS: 10000 })
      .then((m) => m)
      .catch((err) => {
        cached.promise = null;
        throw err;
      });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export function isValidId(id) {
  return typeof id === 'string' && mongoose.Types.ObjectId.isValid(id) && /^[a-f0-9]{24}$/i.test(id);
}

// Turn Mongoose documents into plain JSON-safe objects for React props.
export function plain(doc) {
  return doc == null ? doc : JSON.parse(JSON.stringify(doc));
}
