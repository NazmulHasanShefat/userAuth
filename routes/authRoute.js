import express from "express";
import { login, logout, regiter, sendVarifyOtp, verifyEmail } from "../controllers/authController.js";
import userAuth from "../middlewares/userAuth.js";

const authRouter = express.Router();

authRouter.post("/resiter", regiter);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.post("/send-verify-otp", userAuth, sendVarifyOtp);
authRouter.post("/verify-acount",userAuth, verifyEmail );


authRouter.get("/any", (req, res)=>{
    res.json({message: "hello"});
})

export default authRouter;