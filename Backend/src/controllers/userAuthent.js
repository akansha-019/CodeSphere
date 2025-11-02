 //checking user data and validating it and storing indb  

const User=require("../models/user") //importing
const validator=require('../utils/validate');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const redisClient=require("../config/redis");
const Submission=require("../models/submission");
const { findById } = require('../models/user');
const {findByIdAndDelete} = require("../models/user");
const { deleteMany } = require("../models/submission");

//register
const register=async (req, res)=>{
    try{
        //validate the data
        validator(req.body);
        const {firstName,  emailId, password}=req.body;
         req.body.password=await bcrypt.hash(password, 10);
         // hashing the password before storing in db 10 times 
        req.body.role='user';

         const user= await  User.create(req.body);
            // create method to store data in db
         const token=jwt.sign({_id:user._id, emailId:emailId, role:user.role},process.env.JWT_SECRET,{expiresIn: 60*60}) // creating token using random string and expiry in 1hr , ie logout within 1 hr ie token valide only for 1 hr 
         res.cookie('token', token,{maxAge: 60*60*1000}); // 1000 to convert to milliseconds
         res.status(201).send("user registeration successfull");


    }
    catch(err){
        res.status(400).send("Error:"+err);
    }
}

//login 
const login=async(req,res)=>{
    try{
        const {emailId, password}=req.body;
        if(!emailId)
            throw new Error("Invalid emailId");
        if(!password)
             throw new Error("Invalid password");
            const user=await User.findOne({emailId});

            const ans=bcrypt.compare(password, user.password);
            if(!ans)
                throw new Error("Invalid Credentials");

        const token=jwt.sign({_id:user._id,emailId, role: user.role}, process.env.JWT_SECRET ,{expiresIn: 60*60}) // creating token using random string and expiry in 1hr , ie logout within 1 hr ie token valide only for 1 hr 
         res.cookie('token', token,{maxAge: 60*60*1000});
         res.status(200).send("Logged in successfully");

    }
    catch(err){
        res.status(401).send("Error:"+err); //inbuild err error object 
    }
}


//logout
const logout=async(req,res)=>{
    try{
        const {token}=req.cookies;

        const payload=jwt.decode(token);

        await redisClient.set(`token: ${token}`, 'Blocked'); //set 
        await redisClient.expireAt(`token:${token}`,1000); //expire at 

       //check valid token or not(middleware creation ) 
       // add token to redis blocklist 

        
       // clear the cookies

       res.cookies("token",null,{expires : new Date(Date.now())});
       res.send("Logged Out successfully"); 


    }catch(err){
        res.status(401).send("Error:"+err);
    }
}

//adminregister 
const adminRegister=async (req, res)=>{
    try{
        // if(req.result.role!='admin')
        //     throw new Error("Invalid credentials");
        //validate the data
        validator(req.body);
        const {firstName,  emailId, password}=req.body;
         req.body.password=await bcrypt.hash(password, 10);
         // hashing the password before storing in db 10 times 
         req.body.role='admin';

         const user= await  User.create(req.body);
            // create method to store data in db
         const token=jwt.sign({_id:user._id,emailId,role:user.role},process.env.JWT_SECRET,{expiresIn: 60*60}) // creating token using random string and expiry in 1hr , ie logout within 1 hr ie token valide only for 1 hr 
         res.cookie('token', token,{maxAge: 60*60*1000}); // 1000 to convert to milliseconds
         res.status(201).send("user registeration successfull");


    }
    catch(err){
        res.status(400).send("Error:"+err);
    }
}
 //delete 
const deleteProfile=async(req,res)=>{
    try{
        const userId=(req.result && req.result._id);

      await  User.findByIdAndDelete(userId);//userSchema delete
    //   await Submission.deleteMany({userId});//submissionSchema delete
    //go towards user.js and using .post it will delete all the submissions of that user
    
      
      res.status(200).send("Profile Deleted Successfully");



    }catch(err){
        res.status(500).send("Error:"+err);
    }
}









 module.exports ={ register, login , logout, adminRegister};
