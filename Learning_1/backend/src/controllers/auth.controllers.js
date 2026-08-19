import userModel from '../models/user.model.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


async function userRegister(req,res){
    const {username,email,password}=req.body

    const isalreadyregisted=await userModel.findOne({
        $or:[
            {username},  {email}
        ]
    })

    if(isalreadyregisted){
        return res.status(409).json({message:"user already exists"})
    }

    const hash=await bcrypt.hash(password,10)

    const user=await userModel.create({
        username,
        email,
        password:hash
    }
    )


const token=jwt.sign({
    id:user._id},process.env.JWT_SECRET,{expiresIn:"1h"})
    res.cookie("token",token)

    const userObj=user.toObject()
    delete userObj.password
    return res.status(201).json({
    message: "User registered successfully",
    user:userObj
})

}


export default userRegister