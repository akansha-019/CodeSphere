//main file
const express =require('express');  //accesing express from node_modules using require 
const app=express();
app.use(express.json()); // JSON converts the object data into string data and vice versa 
// here revert (parser) to object data from string data 


const authRouter = require("./routes/userAuth");
app.use('/user', authRouter);


require('dotenv').config(); //to access .env file
const main=require('./config/db')

const cookieParser=require('cookie-parser');// cookie parser is to store the token and user credentials in browser storage ;
app.use(cookieParser());

const redisClient = require('./config/redis');

const problemRouter=require('./routes/problemCreator');
app.use('/problem', problemRouter);

const submitRouter=require('./routes/submit');
app.use('/submission',submitRouter);


const InitalizeConnection=async ()=>{
  try{
    await Promise.all([main(), redisClient.connect()]);
    console.log("db connected");
     
    const port = process.env.PORT || 3000;
    app.listen(port,()=>{
     console.log("server listening at port no : " + port);
    })
  }
   catch(err){  console.log("Error Occurred:", err);};

   
}
   InitalizeConnection(); 

  