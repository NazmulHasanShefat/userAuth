import mongoose from "mongoose";

const dbConnect = async ()=>{
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log("✅ db connected successfully");
    } catch (error) {
        console.log("❌ faild to connect database Error:",error)
    }
}
export default dbConnect;