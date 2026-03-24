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
            subject: "wellcome to our userAuth",
            text: `
            <h1>wellcome to our website</h1>
            wellcome to our website well all are happy to creater you a acount
            your email is: ${email}`,
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

// ========================================== SEND OTP =============================================
export const sendVarifyOtp = async (req, res) => {
    try {
        const userId = req.userId; // ✅ req.body থেকে নয়
        const user = await userModel.findById(userId)

        if (user.isVerifiedUser) {
            return res.json({ success: false, message: "acount alrady verified" })
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));
        user.verifyOtp = otp;

        user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;

        await user.save();

        // send otp to user mailbox
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Varification OTP",
            text: `
            <h1>Acount varification Otp</h1>
            <h3>Your verification code is: ${otp}</h3>
            <p>This code expires in 10 minutes. Do not share it with anyone.</p>
            – [From userAuth app]
            `
        }

        await transporter.sendMail(mailOptions);

        res.json({ success: true, message: "verification email send successfully" });

    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        })
    }
}

// ================================== WHEN USER PUT OTP VERIFY IT ==================================
export const verifyEmail = async (req, res) => {
    const { otp } = req.body;
    const userId = req.userId;

    if (!userId || !otp) {
        return res.json({
            success: false,
            message: "missing details"
        })
    }
    try {
        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({
                success: false,
                message: "user not found"
            })
        }
        if (user.verifyOtp === "" || user.verifyOtp !== otp) {
            return res.json({
                success: false,
                message: "invalid otp"
            })
        }
        if(user.verifyOtpExpireAt < Date.now()){
            return res.json({
                success: false,
                message: "otp expired"
            })
        }
        user.isVerifiedUser = true;
        user.verifyOtp = "";
        user.verifyOtpExpireAt = 0;
        await user.save();

        res.json({
            success: true,
            message: "user verified successfully"
        })

    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        })
    }
}

// =================================== CHECK USER IS AUTHENTICATED =================================
export const isAuthenticated = async(req, res) => {
    try {
        return res.json({ success:true, message: "user authrized successfully"});
    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        })
    }
}

// ===================================== SEND PASSWORD RESET OTP ===================================
export const sendPassResetOtp = async (req, res) => {
    
    try {
        // aproje 1 
    //    const userId = req.userId;
    //    const user = await userModel.findById(userId);
       
       
       // aproje 2 
       const { email } = req.body;

       if(!email){
        return res.json({ success:false, message: "email is required"});
       }

       const user = await userModel.findOne({ email });
       if(!user){
        return res.json({ success: false, message: "user not found"});
       }


       const otp = String(Math.floor(100000 + Math.random() * 900000));

       user.resetOtp = otp;
       user.resetExpireAt = Date.now() + 5 * 60 * 1000;
       
       await user.save();

      // send otp to user email
      const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: user.email,
        subject: `Reset otp is ${otp}`,
        text: `
            <h1>Acount varification Otp</h1>
            <h3>Your verification code is: ${otp}</h3>
            <p>This code expires in 10 minutes. Do not share it with anyone.</p>
            – [From userAuth app]    
        `
      }
    //   send the email useing tranporter configaration
    await transporter.sendMail(mailOptions);
    
    return res.json({
        success: true,
        message: "reset otp send successfully"
    })

    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        })
    }
}

// ===================================== verify reset password =====================================
export const setResetPassword = async (req, res) =>{
    const { email, otp, newPassword } = req.body;
    if(!email || !otp || !newPassword){
        return res.json({ success: false, message: "email otp or password is required"});
    }
    try {
        const user = await userModel.findOne({ email });
        if(!user){
            return res.json({ success: false, message: "user not found"})
        }
        if(user.resetOtp === "" || user.resetOtp !== otp){
            return res.json({ success: false, message: "invalid otp"});
        }
        if(user.resetExpireAt < Date.now()){
            return res.json({ success: false, message: "otp expired"});
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedNewPassword;
        user.resetOtp = "";
        user.resetExpireAt = 0;

        await user.save();
        return res.json({ success: true, message: "password reset successfully"});

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}
