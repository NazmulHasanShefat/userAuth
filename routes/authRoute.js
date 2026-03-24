import express from "express";
import { isAuthenticated, login, logout, regiter, sendPassResetOtp, sendVarifyOtp, setResetPassword, verifyEmail } from "../controllers/authController.js";
import userAuth from "../middlewares/userAuth.js";

const authRouter = express.Router();

authRouter.post("/register", regiter);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.post("/send-verify-otp", userAuth, sendVarifyOtp);
authRouter.post("/verify-acount", userAuth, verifyEmail );
authRouter.post("/is-auth",userAuth, isAuthenticated );
authRouter.post("/send-pass-reset-otp",userAuth, sendPassResetOtp );
authRouter.post("/reset-password",userAuth, setResetPassword );


authRouter.get("/any", (req, res)=>{
    res.json({message: "hello"});
})

export default authRouter;