import 'dotenv/config'
import mongoose from 'mongoose'


async function connectDB(){
    if(!process.env.MONGO_URI){
        throw new Error("MONGO_URI is not in env file")
    }
    try{
        await  mongoose.connect(process.env.MONGO_URI)
        console.log("Database Connected")
    }
    catch(error){
        console.error(error)
        process.exit(1)
    }
}

export default connectDB
