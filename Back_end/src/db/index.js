import mongoose from 'mongoose';
import { config } from 'dotenv';
import { DB_NAME } from '../constants.js';
config();

console.log('MongoDB URI:', process.env.MONGODB_URI);

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(process.env.MONGODB_URI, {
            dbName: DB_NAME
        });
        console.log(`\nMongoDb Connection! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("MONGODB CONNECTION ERROR.. ", error);
        process.exit(1);
    }
};

export default connectDB;

