import mongoose from "mongoose";

export function mongooseConnect() {
    if (mongoose.connection.readyState === 1) {
        return mongoose.connection.asPromise();
    } else {
        const url = 'mongodb://172.17.0.1:27017/test';
        return mongoose.connect(url);
    }
} 