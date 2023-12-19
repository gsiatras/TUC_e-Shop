import mongoose from "mongoose";

export function mongooseConnect() {
    if (mongoose.connection.readyState === 1) {
        return mongoose.connection.asPromise();
    } else {
        const url = 'mongodb://localhost:27017';
        return mongoose.connect(url);
    }
} 