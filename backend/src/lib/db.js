import mongoose from 'mongoose';

export const connectDB = async () => { 
    try {
      // console.log("MongoDB URI:", process.env.MONGODB_URI); 
      const con=  await mongoose.connect(process.env.MONGODB_URI);
      console.log(`MongoDB connected: ${con.connection.host}`);
    } catch (error) {
        console.log("MongoDB connection failed",error.message);
    }
}