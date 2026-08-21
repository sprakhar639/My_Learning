import userModel from "../models/user.model.js";
import jwt from 'jsonwebtoken'

async function getMe(req, res) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized access" });
  }
   
  try{
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  console.log(decoded)
  req.user=decoded
  const user=await userModel.findById(req.user.id)
  if(user){

    return res.status(201).json({message:"user fetched successfully",user})
  }
  }
  catch(error){
     return res.status(401).json({ message: "Invalid token" });
  }
}

export default getMe;
