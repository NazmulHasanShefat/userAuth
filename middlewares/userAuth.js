import jwt from "jsonwebtoken";

const userAuth = async (req, res, next)=>{
    const { token } = req.cookies;
    if(!token){
        return res.json({
            success: false,
            message: "not authorized login again"
        })
    }

    try {
      const tokenDecoded = jwt.verify(token, process.env.JWT_SECRAT)
      if(tokenDecoded.id){
        req.userId = tokenDecoded.id
    }else{
        return res.json({
            success: false,
            message: "not authorized login again"
        })
    }
    next();

    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        })
    }
}
console.log(process.env.JWT_SECRAT)
export default userAuth;