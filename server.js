import express from "express";
import { configDotenv } from "dotenv";
import cors from "cors"
import cookieParser from "cookie-parser";
import dbConnect from "./db/dbConnect.js";
import dns from "dns"
dns.setServers(["1.1.1.1","8.8.8.8"])

configDotenv();

const app = express();
app.use(express.json())
dbConnect();
app.get("/",(req, res)=>{
    res.send({message: "Welcome to auth js"});
})

const port = process.env.PORT || 5000
app.listen(port, ()=>{
    console.log(`server is running on port: http://localhost:${port}`)
})
