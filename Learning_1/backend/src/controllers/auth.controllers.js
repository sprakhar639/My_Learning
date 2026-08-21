import userModel from "../models/user.model.js";
import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import SessionModel from "../models/session.model.js";

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

  const refreshToken = jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );

  const refreshTokenHash = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  const session = await SessionModel.create({
    userId: user._id,
    refreshTokenHash,
    ip: req.ip,
    userAgent: req.headers["user-agent"],
  });

  const accessToken = jwt.sign(
    {
      id: user._id,
      sessionId: session.id,
    },
    process.env.JWT_SECRET,
    { expiresIn: "15m" },
  );

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  const userObj = user.toObject();
  delete userObj.password;
  return res.status(201).json({
    message: "User registered successfully",
    user: userObj,
    accessToken,
  });
}

async function refreshToken(req, res) {
  const oldrefreshToken = req.cookies.refreshToken;

  if (!oldrefreshToken) {
    return res.status(401).json({ Message: "Unauthorized Access" });
  }

  try {
    const decoded = jwt.verify(oldrefreshToken, process.env.JWT_SECRET);

    const oldRefreshTokenHash = crypto
      .createHash("sha256")
      .update(oldrefreshToken)
      .digest("hex");

    const session = await SessionModel.findOne({
      refreshTokenHash: oldRefreshTokenHash,
      userId: decoded.id,
      revoked:false
    });

    if (!session) {
      return res.status(401).json({
        message: "Invalid refresh token",
      });
    }

    const newRefreshToken = jwt.sign(
      { id: decoded.id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    const newRefreshTokenHash = crypto
      .createHash("sha256")
      .update(newRefreshToken)
      .digest("hex");

    session.refreshTokenHash = newRefreshTokenHash;
    await session.save();

    const accessToken = jwt.sign(
      {
        id: decoded.id,
        sessionId: session.id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "15m" },
    );

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res
      .status(200)
      .json({ message: "Access token Generated", accessToken });
  } catch (error) {
    return res.status(404).json({ message: "Invalid or exipred token" });
  }
}

async function logOut(req, res) {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(400).json({ message: "Refresh Token not found" });
  }

  try {
    const refreshTokenHash = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    const session = await SessionModel.findOne({
      refreshTokenHash,
      revoked: false,
    });

    if (!session) {
      return res.status(400).json({ Message: "Session not found" });
    }

    session.revoked = true;
    await session.save();

    res.clearCookie("refreshToken");

    res.status(200).json({
      message: "Logged out Successfully",
    });
  } catch (error) {
    console.error(error);
  }
}

export { userRegister, refreshToken, logOut };
