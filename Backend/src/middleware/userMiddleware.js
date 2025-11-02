const jwt=require("jsonwebtoken");
const User = require("../models/user");
const redisClient = require("../config/redis")
require('dotenv').config();

const userMiddleware=async(req, res,next)=>{
    try{
        const {token}=req.cookies;
        if(!token)
            throw new Error("token is not present");
         const payload= jwt.verify( token,process.env.JWT_SECRET);

         //aas payload contains very detail, only access id as follow 

         const {_id}=payload;
         if(!_id){
            throw new Error("id missing");
         }

        const result=await User.findById(_id);


        if(!result){
            throw new Error("user doesn't exist");
        }


        // check whether redis blocklist contains this user id 
        const IsBlocked = await redisClient.exists(`token:${token}`);
        if(IsBlocked)
            throw new Error("Invalid Token");
        
        req.result=result;
        next();

    }
    catch(err){
         console.error("Authentication Error:", err.message);
        res.status(503).send("Error:"+err.message);
    }
}
module.exports= userMiddleware;