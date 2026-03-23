import mongoose, { Schema } from "mongoose";

const userScheam = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true},
        password: { type: String, required: true },
        verifyOtp: { type: String, default: ""},
        verifyOtpExpireAt: { type: Number, default: 0},
        isVerifiedUser: { type: Boolean, default: false},
        resetOtp: { type: String, default: ""},
        resetExpireAt: { type: Number, default: 0}
    }
)

const userModel = mongoose.models.user || mongoose.model("user", userScheam);
export default userModel;