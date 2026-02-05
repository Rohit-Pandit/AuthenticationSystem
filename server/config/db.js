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

// VITE_BACKEND_URL=https://mern-auth-backend-n364.onrender.com
//  VITE_BACKEND_URL=http://127.0.0.1:3000