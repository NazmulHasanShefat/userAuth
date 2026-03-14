import bcrypt from "bcryptjs";
import userModel from "../models/user.model.js";

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
        if(existingUser){
            return res.json({
            success: false,
            message: "same user alrady exist"
        })
        }
        const hashedPassword = await bcrypt.hash(passord, 10);

        const user = new userModel({name, email, passord:hashedPassword})
        await user.save()

        // 41:88 video end time gets start tomoro
        
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
} 