//created schema for user 
const mongoose = require('mongoose');
const {Schema}=mongoose;
const userSchema=new Schema({
    //validations 

    firstName:{
        type:String, 
        required: true, //mandatory field 
        minLength:2,
        maxLength:20,
    },
    lastName:{
        type:String, 
        required:true,
        minlength:3,
        maxLength:20,

    },
    emailId:{
        type:String,
        required:true,
        unique:true, // no two users can have same email id
        trim:true,
        Lowercase:true,
        immutable:true, // email id cannot be changed

    },
    age:{
        type:Number,
        min:6,
        max:80,
    },
    role:{
        type:String,
        enum:['user','admin'],// only 2 roles are allowed 
        default:'user'
    },
    password:{
        type:String,
        required:true,
    
    },
    problemSolved:{    //used to store unique problem that user had solved 
        type:[{
            type:Schema.Types.ObjectId,
            ref:'problem'
        }],
          unique:true
    }
    
},{
    timestamps:true

}
);

submissionSchema.index({userId:1, problemId:1}); //compound index to ensure unique problemSolved entries

userSchema.post('findOneAndDelete', async function (userInfo) {
    if(userInfo){
        await mongoose.model('submission').deleteMany({ userId: userInfo._id });
    }
});



const User=mongoose.model("user", userSchema);
module.exports=User;