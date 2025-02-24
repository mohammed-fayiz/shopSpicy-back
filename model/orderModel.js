const mongoose=require('mongoose')

const orderSchema=new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId,ref:"user_tbl"},
    productId:{type:mongoose.Schema.Types.ObjectId,ref:"prod_tbl"},
    cartId:{type:mongoose.Schema.Types.ObjectId,ref:"cart_tbl"},
    landmark:{type:String},
    pincode:{type:String},
    city:{type:String},
    state:{type:String},
    quantity:{type:String},
    orderstatus:{type:String}
},{timestamps:true})

const orderModel=new mongoose.model('order_tbl',orderSchema)

module.exports=orderModel