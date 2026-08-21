import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "User is required"],
    },
    refreshTokenHash: {
      type: String,
      required: [true, "RefreshToken is required"],
    },
    ip: {
      type: String,
      required: [true, "ip is required"],
    },
    userAgent: {
      type: String,
      required: [true, "User agent is required"],
    },
    revoked: {
      type: Boolean,
      default: "false",
    },
  },

  {
    timestamps: true,
  },
);

const SessionModel = mongoose.model("Session", sessionSchema);

export default SessionModel;
