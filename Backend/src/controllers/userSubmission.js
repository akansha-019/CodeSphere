const Problem=require("../models/problem");
const Submission=require("../models/submission");
const User=require("../models/user");
const {getLanguageById,submitBatch,submitToken}=require("../utils/problemUtility");



const submitCode=async(req,res)=>{
    // Logic for handling user code submission
    try{
        const userId=(req.result && req.result._id);
        const problemId=req.params.id;
        const {code,language}=req.body;

        if(!userId || !problemId || !code || !language){
            return res.status(400).send("Missing Required Fields");
        }

        //fetch the problem from database
        const problem= await Problem.findById(problemId);
        //hidden testcases
         if (!problem) {
            return res.status(404).send("Problem not found.");
        }

        //first store submission data into database with pending status
        const submittedResult= await Submission.create({
            userId,
            problemId,
            code,
            language,
            status:"pending",
            testCasesTotal:problem.hiddenTestCases.length
        })

        //submt code to judge0 
        const languageId=getLanguageById(language);
        const submission = problem.hiddenTestCases.map((testcase)=>({
            source_code:code,
            language_id:languageId,
            stdin: testcase.input,
            expected_output: testcase.output
             
         }));

         const submitResult= await submitBatch(submission);
         const resultToken = submitResult.map((value)=> value.token);
         const testResult= await submitToken(resultToken);


         //update submittedresult in database
         let testCasesPassed=0;
         let runtime=0;
         let memory=0;
         let status='accepted';
         let errorMessage=null;


         for(const test of testResult){
            if(test.status_id==3){
                testCasesPassed++;
                runtime=runtime+parseFloat(test.time)
                memory=Math.max(memory,test.memory);
            }else{
                if(test.status_id==4){
                    status='error'
                    errorMessage=test.stderr
                }
                else{
                    status='wrong'
                    errorMessage=test.stderr
                }
            }
         }
//store the result in database in submission 
         submittedResult.status=status;
         submittedResult.testCasesPassed=testCasesPassed;
         submittedResult.errorMessage=errorMessage;
         submittedResult.runtime=runtime;
         submittedResult.memory=memory;

         await submittedResult.save();

        //insert problemId into userSchema -problemSolved if it is not present 

        if(submittedResult.status === 'accepted' && req.result && req.result.problemSolved &&  !req.result.problemSolved.includes(problemId)){
            req.result.problemSolved.push(problemId);
            await req.result.save();    
        }
         res.status(201).send(submittedResult);


    }catch(err){
        res.status(500).send("internal server error"+err);
    }

}

const runCode=async(req,res)=>{
     try{
        const userId=(req.result && req.result._id);
        const problemId=req.params.id;
        const {code,language}=req.body;

        if(!userId || !problemId || !code || !language){
            return res.status(400).send("Missing Required Fields");
        }

        //fetch the problem from database
        const problem= await Problem.findById(problemId);
        //hidden testcases
         if (!problem) {
            return res.status(404).send("Problem not found.");
        }

        //submt code to judge0 
        const languageId=getLanguageById(language);

        const submission = problem.visibleTestCases.map((testcase)=>({
            source_code:code,
            language_id:languageId,
            stdin: testcase.input,
            expected_output: testcase.output
             
         }));

         const submitResult= await submitBatch(submission);
         const resultToken = submitResult.map((value)=> value.token);
         const testResult= await submitToken(resultToken);

         res.status(201).send(testResult);
    }
    catch(err){
        res.status(500).send("internal server error"+err);
    }
}

module.exports={submitCode,runCode} ;
