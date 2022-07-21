const mongoose =require("mongoose")

const userSchema= new mongoose.Schema({
    name:String,
    email:String,
    password:String,
})
const errorSchema= new mongoose.Schema({
   error:String
})
module.exports=   mongoose.model("error",errorSchema)
module.exports=   mongoose.model("users",userSchema)