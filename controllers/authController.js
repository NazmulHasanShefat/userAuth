import bcrypt from "bcryptjs";
import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import transporter from "../config/nodeMailer.config.js";

// ekhane regiter login logout verifyAcout and passord reset esob kaj kora hoy controller er moddhe
export const regiter = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
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
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new userModel({ name, email, password: hashedPassword })
        await user.save()

        // genarate user token

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRAT, { expiresIn: "7d" });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "node" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        // send email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: "wellcome to out website",
            text: `wellcome to out website well all are happy to creater you a acount
            your email is: ${ email }`,
        }
        await transporter.sendMail(mailOptions);

        return res.json({
            success: true,
            message: "user registerd successfull"
        })

    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
        console.log(error)
    }
}


// ========================================= USER LOGIN ============================================
export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
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
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({
                success: false,
                message: "invalid password"
            })
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRAT, { expiresIn: "7d" });

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