import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config();
const connectDB = async ()=>{
     try{
if(!process.env.MONGO_URI){
     throw new Error("mongo_uri not found from .env file");

}
const conn = await mongoose.connect(process.env.MONGO_URI,{
    useNewUrlParser: true,
      useUnifiedTopology: true, 
})

    console.log(`MongoDB Connected: ${conn.connection.host}`);
     }catch(error){
 console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1); // Stop the app if DB connection fails
     }
}

export default connectDB;

