import mongoose from "mongoose";

export function mongooseConnect() {
    if (mongoose.connection.readyState === 1) {
        return mongoose.connection.asPromise();
    } else {
        const url = process.env.MONGODB_URI || 'mongodb://localhost:27018/orders';
        return mongoose.connect(url);
    }
} 