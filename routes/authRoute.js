import express from "express";
import { login, logout, regiter } from "../controllers/authController.js";

const authRouter = express.Router();

authRouter.post("/resiter", regiter);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.get("/any", (req, res)=>{
    res.json({message: "hello"});
})

export default authRouter;