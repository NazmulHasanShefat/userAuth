import userModel from "../models/user.model.js";

export const getUserData = async (req, res)=>{
    try {
        const userId = req.userId;
        const user = await userModel.findById(userId);
        if(!user){
            return res.json({ success: false, message: "user not found"});
        }
        res.json(
            {
                success: true,
                userData: {
                    Name: user.name,
                    email:user.email,
                    verifyStatus: user.isVerifiedUser
                }
            }
        )
    } catch (error) {
        return res.json({ success: false, message: error.message});
    }
}