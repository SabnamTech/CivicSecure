import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongod;

const connectDB = async () => {
    try {
        if (process.env.NODE_ENV === 'development') {
            // Use in-memory database for prototype
            mongod = await MongoMemoryServer.create();
            const mongoUri = mongod.getUri();
            const conn = await mongoose.connect(mongoUri);
            console.log(`✅ MongoDB In-Memory Connected (Prototype): ${conn.connection.host}`);
        } else {
            const conn = await mongoose.connect(process.env.MONGODB_URI);
            console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        }
    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message);
        process.exit(1);
    }
};

export default connectDB;
