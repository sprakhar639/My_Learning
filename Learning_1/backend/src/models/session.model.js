import mongoose from "mongoose";
import { refreshToken } from "../controllers/auth.controllers";

const sessionSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:[true,"User is required"]
    },
    refreshToken:{
        type:String,
        required:[true,"RefreshToken is required"]
    },
    ip:{
        type:String,
        required:[true,"ip is required"]
    },
    userAgent:{
        type:String,
        required:[true,"User agent is required"]
    },
    revoke:{
        type:Boolean,
        default:"false"
    },
    timestamps:true
})


const SessionModel=mongoose.model("Session",sessionSchema)


export default SessionModel