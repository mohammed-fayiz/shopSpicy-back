const mongoose=require('mongoose')

const productSchema=new mongoose.Schema({
    userType:{type:String},
    imagelink:{type:String},
    prodname:{type:String},
    quantity:{type:String},
    desc:{type:String},
    mrp:{type:String}
},{timestamps:true})

const productModel=new mongoose.model("prod_tbl",productSchema)

module.exports=productModel