const mongoose=require('mongoose')

const userSchema=new mongoose.Schema({
    username:{type:String},
    email:{type:String},
    mobile:{type:String},
    userType:{type:String},
    password:{type:String},
    isActive:{type:String},
},{timestamps:true})

const userModel=new mongoose.model('user_tbl',userSchema)

module.exports=userModel