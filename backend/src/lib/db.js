import mongoose from "mongoose";

export const connectDB = async()=>{
    try {
        const connection  = await mongoose.connect(process.env.MONGO_URI);
        console.log("mongoDB Connected Successfully")
    } catch (error) {
        console.log("Error connecting mongoDB " ,error);
        process.exit(1);
    }
}