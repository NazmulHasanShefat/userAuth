import bcrypt from "bcryptjs";
import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";

// ekhane regiter login logout verifyAcout and passord reset esob kaj kora hoy controller er moddhe
export const regiter = async (req, res) => {
    const { name, email, passord } = req.body;

    if (!name || !email || !passord) {
        return res.json({
            success: false,
            message: "missing details required!"
        })
    }

    try {
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.json({
                success: false,
                message: "same user alrady exist"
            })
        }
        const hashedPassword = await bcrypt.hash(passord, 10);

        const user = new userModel({ name, email, passord: hashedPassword })
        await user.save()

        // genarate user token

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRAT, { expireIn: "7d" });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "node" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.json({
            success: true,
            message: "user registerd successfull"
        })

    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}


// ========================================= USER LOGIN ============================================
export const login = async (req, res) => {
    const { email, passord } = req.body;

    if (!email || !passord) {
        return res.json({
            success: false,
            message: "Name or Email is required"
        })
    }
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({
                success: false,
                message: "invalid email"
            })
        }
        const isMatch = await bcrypt.compare(passord, user.passord);
        if (!isMatch) {
            return res.json({
                success: false,
                message: "invalid password"
            })
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRAT, { expireIn: "7d" });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "node" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.json({
            success: true,
            message: "user login successfull"
        })

    } catch (error) {
        res.json({
            success: false,
            message: "user login faild"
        })
        console.log("user login faild")
    }
}

// ========================================= USER LOGOUT ===========================================
export const logout = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "node" : "strict"
        })

        return res.json({
            success: true,
            message: "logged out"
        })
        
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
        console.log(error)
    }
}