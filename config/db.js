import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGO_URI)
        console.log("MongoDB Connected")
    } catch (error) {
        console.log("Error Connection To MongoDB", error)
        process.exit(1); // 1 for failure, 0 for success
    }
}