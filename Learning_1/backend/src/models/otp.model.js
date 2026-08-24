import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
    },
    otpHash: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const otpModel = mongoose.model("Otp", otpSchema);

export default otpModel;
