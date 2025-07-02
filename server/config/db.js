import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const connectDB = async ()=>{
    mongoose.connection.on('connected' , ()=>{
        console.log("Database Connected");
    })
    await mongoose.connect(process.env.MONGODB_URL)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Connection error', err));
};

export default connectDB