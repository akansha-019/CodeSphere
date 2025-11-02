const mongoose=require('mongoose');
async function main(){ // async function to connect to mongoDB
     await mongoose.connect(process.env.DB_CONNECT_STRING);

}
module.exports=main;