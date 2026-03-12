import mongoose from 'mongoose';
import dns from 'dns';

// Override DNS to use Google (8.8.8.8) — local router DNS can't resolve Atlas SRV records
dns.setServers(['8.8.8.8', '8.8.4.4']);

let cached = (global as any).mongoose;

if (!cached) {
    cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
    const MONGODB_URI = process.env.MONGODB_URI;

    if (!MONGODB_URI) {
        throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
    }

    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };

        cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
            return mongoose;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (error) {
        // Reset the cached promise so the next call retries the connection
        cached.promise = null;
        throw error;
    }

    return cached.conn;
}

export default dbConnect;
