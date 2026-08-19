import userModel from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

async function userRegister(req, res) {
  const { username, email, password } = req.body;

  const isalreadyregisted = await userModel.findOne({
    $or: [{ username }, { email }],
  });

  if (isalreadyregisted) {
    return res.status(409).json({ message: "user already exists" });
  }

  const hash = await bcrypt.hash(password, 10);

  const user = await userModel.create({
    username,
    email,
    password: hash,
  });




  const accessToken = jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRET,
    { expiresIn: "15m" },
  );



  const refreshToken = jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );




  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });



  const userObj = user.toObject();
  delete userObj.password;
  return res.status(201).json({
    message: "User registered successfully",
    user: userObj,
    accessToken
  });
}



async function refreshToken(req,res){
      const refreshToken=req.cookies.refreshToken

    if(!refreshToken){
        return res.error(401).json({Message:"Unauthorized Access"})
    }

try {
    const decoded=jwt.verify(refreshToken,process.env.JWT_SECRET)

    const accessToken=jwt.sign({
        id:decoded.id
    },process.env.JWT_SECRET,{expiresIn:"15m"})

    const newRefreshToken=jwt.sign({id:decoded.id},process.env.JWT_SECRET,{expiresIn:"7d"})
    console.log(refreshToken)

    res.cookie("refreshToken",newRefreshToken,{httpOnly: true,
    secure: false,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000})

    return res.status(200).json({message:"Access token Generated",accessToken})
}
catch(error){
     return res.status(404).json({message:"Invalid or exipred token"})
}
}




export {userRegister,refreshToken};
