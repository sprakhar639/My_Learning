import 'dotenv/config'
import mongoose from 'mongoose'


async function connectDB(){
    if(!process.env.MONGO_URI){
        throw new Error("MONGO_URI is not in env file")
    }
    if(!process.env.JWT_SECRET){
        throw new Error("JWT_SECRET is not in env file")
    }
    if(!process.env.GOOGLE_CLINT_ID){
        throw new Error("GOOGLE_CLINT_ID is not in env file")
    }
    if(!process.env.GOOGLE_SECRET){
        throw new Error("GOOGLE_SECRET is not in env file")
    }
    if(!process.env.GOOGLE_REFRESH_TOKEN){
        throw new Error("GOOGLE_REFRESH_TOKEN is not in env file")
    }
    if(!process.env.GOOGLE_USER){
        throw new Error("GOOGLE_USER is not in env file")
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
