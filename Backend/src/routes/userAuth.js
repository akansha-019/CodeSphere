//pages for user authentication 
const express=require('express'); //server
const authRouter=express.Router();//path
const {register, login, logout, adminRegister,deleteProfile}=require('../controllers/userAuthent')
const userMiddleware=require("../middleware/userMiddleware");
 const adminMiddleware=require("../middleware/adminMiddleware");


//register 
authRouter.post('/register',register);//bydeault request
authRouter.post('/login',login);
authRouter.post('/logout',userMiddleware,logout);
// authRouter.get('/getprofile',getProfile);
authRouter.post('/admin/register',adminMiddleware, adminRegister);
authRouter.delete('/deleteProfile', userMiddleware, deleteProfile);

// if any user go with path: user/register then the role =user as above
//and new path for admin register as follow , and admin will allow admin to register 
//first admin will be written manually in database 

authRouter.post('/admin/register', adminRegister);


module.exports=authRouter;




// login 

// logout,
//  getprofile.


