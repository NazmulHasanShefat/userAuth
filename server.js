import express from "express";
import { configDotenv } from "dotenv";
import cors from "cors"
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoute.js"
import dbConnect from "./db/dbConnect.js";
import dns from "dns"
import userRouter from "./routes/userRouter.js";
dns.setServers(["1.1.1.1","8.8.8.8"])

configDotenv();

const app = express();
dbConnect();

app.use(express.json());
app.use(cookieParser());
app.use(cors({credentials: true}));


// api endpoints
app.get("/",(req, res)=>{
    res.send({message: "Welcome to auth js"});
})
app.use("/api/auth", authRoutes);
app.use("/api/users", userRouter);

const port = process.env.PORT || 5000
app.listen(port, ()=>{
    console.log(`server is running on port: http://localhost:${port}`)
})
