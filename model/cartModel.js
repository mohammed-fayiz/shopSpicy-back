const mongoose=require('mongoose')

const cartSchema=new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId,ref:"user_tbl"},
    items:[{
        productId:{type:mongoose.Schema.Types.ObjectId,ref:"prod_tbl"},
        quantity:{type:Number}
    }]
},{timestamps:true})

const cartModel=new mongoose.model("cart_tbl",cartSchema)

module.exports=cartModel