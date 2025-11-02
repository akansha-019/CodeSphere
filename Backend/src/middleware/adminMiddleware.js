const jwt = require("jsonwebtoken");
const User = require("../models/user");
const redisClient = require("../config/redis")


const adminMiddleware = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token)
            throw new Error("token is not present");

        const payload= jwt.verify( token,process.env.JWT_SECRET);
         //aas payload contains very detail, only access id as follow 
         const {_id} = payload;

         if(!_id){
            throw new Error("id missing");
         }
        
        const result=await User.findById(_id);//check in database
         if(!result)
            throw new Error("user doesn't exist");

        // check whether redis blocklist contains this user id 
        const isBlocked = await redisClient.exists(`token:${token}`);
         if(isBlocked)
            throw new Error("Block Token");
        
        //check for role=admin
        if(payload.role!='admin')
            throw new Error("Invalid role token"); 
         // where result is the Mongoose User object

         
        req.result = result;
        //res.send();
        next();
    }
    catch(err){
       return res.status(503).send("Error:"+err);
    }
}
module.exports = adminMiddleware;