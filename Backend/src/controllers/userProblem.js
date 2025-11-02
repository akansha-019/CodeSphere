


const {getLanguageById, submitBatch,submitToken} =require("../utils/problemUtility");
const Problem = require("../models/problem");
const User = require('../models/user');
const { findById } = require('../models/user');
const Submission = require('../models/submission');

const createProblem=async(req, res)=>{
    const { title, description, difficulty,tags,
    visibleTestCases,hiddenTestCases, startCode, 
    referenceSolution
} = req.body;

 try{
     for(const {language, completeCode} of referenceSolution){
        //sourece code
        // lang_id
        // stdin
        //expectedOutput 


         const languageId=getLanguageById(language);
         //batch submission arrray 
         const submission = visibleTestCases.map((testcase)=>({
            source_code:completeCode,
            language_id:languageId,
            stdin: testcase.input,
            expected_output: testcase.output
             
         }));

         const submitResult= await submitBatch(submission);
         // console.log(submitResult);

         const resultToken = submitResult.map((value)=> value.token); //stores in array which contains only tokens
         const testResult= await submitToken(resultToken);
         // console.log(testResult);
          
        for(const test of testResult){
            if(test.status_id!=3){
              return  res.status(400).send("Error Occured ");
            }
        }

     }


      //if above for loop executed successfuly , we can store the data into database 

      const userProblem =await Problem.create({
        ...req.body,
        problemCreator: req.result._id
      });
      res.status(201).send("Problem saved successfully");


 }
 catch(e){
    res.status(400).send("Error:"+(e.message));

 }

}

const updateProblem=async(req,res)=>{
   const {id}=req.params;
   const { title, description, difficulty,tags,
    visibleTestCases,hiddenTestCases, startCode, 
    referenceSolution
} = req.body;

 try{
   if(!id){
     return res.status(400).send("Missing Id Field");
   }

   const DsaProblem = await Problem.findById(id);
   if(!DsaProblem){
      return res.status(404).send("Problem Not Found in server");
   }

   for(const {language, completeCode} of referenceSolution){
       
         const languageId=getLanguageById(language);
         //batch submission arrray 
         const submission = visibleTestCases.map((testcase)=>({
            source_code:completeCode,
            language_id:languageId,
            stdin: testcase.input,
            expected_output: testcase.output
             
         }));

         const submitResult= await submitBatch(submission);
         // console.log(submitResult);

         const resultToken = submitResult.map((value)=> value.token); //stores in array which contains only tokens
         const testResult= await submitToken(resultToken);
         // console.log(testResult);
          
        for(const test of testResult){
            if(test.status_id!=3){
              return  res.status(400).send("Error Occured ");
            }
        }

     }

   const newProblem = await Problem.findByIdAndUpdate(id, {...req.body},{runValidators:true,new :true});// new:true returns the updated document and runValidators:true runs the validators on update
   res.status(200).send(newProblem);

 }
 catch(e){
    res.status(400).send("Error:"+err);

 }
}
 
const deleteProblem=async(req,res)=>{
   const {id}=req.params;
   try{
      if(!id){
         return res.status(400).send("Missing Id Field");
      }

      const deletedProblem = await Problem.findByIdAndDelete(id);

      if(!deletedProblem){
         return res.status(404).send("Problem Not Found in server");
      }

   res.status(200).send("Problem Deleted Successfully");
   }catch(err){
      res.status(500).send("Error:"+err);

   }
}

const getProblemById=async(req,res)=>{
   const {id}=req.params;
   try{
      if(!id){
         return res.status(400).send("Missing Id Field");
      }
      const getProblem= await Problem.findById(id).select('title description difficulty tags visibleTestCases startCode referenceSolution');

      if(!getProblem){
         return res.status(404).send("Problem is Missing ");
      }

      res.status(200).send(getProblem);
   }catch(err){
      res.status(500).send("Error:"+err);
   }

    
}

const getAllProblems=async(req,res)=>{
   
   try{
      
      const getProblem= await Problem.find({}).select('_id title tags difficulty');

      if(getProblem.length==0){
         return res.status(404).send("Problem is Missing ");
      }

      res.status(200).send(getProblem);
   }catch(err){
      res.status(500).send("Error:"+err);
   }

}

const solvedAllProblembyUser=async(req,res)=>{
   try{
      // const count=req.result.problemSolved.length;
      // res.status(200).send({count});// return count of problems solved by user

      const userId= req.result._id ; 
      const user=await User.findById(userId).populate({
      path: 'problemSolved',
      select: " _id title difficulty tags"
    });
      res.status(200).send(user);
   }
   catch(err){
      res.status(500).send("Server error");
   }
}

const submittedProblem=async(req,res)=>{
   try{
      const userId=req.result && req.result._id;
      const problemId=req.params.pid;
     const ans=await Submission.find({userId,problemId});

     if(ans.length==0){
         return res.status(404).send("No Submission Found");
     }

       res.status(200).send(ans);
   }  
   catch(err){
   res.status(500).send("Internal server error"+err);
   }
}



module.exports={createProblem, updateProblem, deleteProblem,getProblemById,getAllProblems,solvedAllProblembyUser, submittedProblem};