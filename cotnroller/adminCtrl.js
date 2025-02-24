const cartModel = require('../model/cartModel')
const orderModel = require('../model/orderModel')
const productModel = require('../model/productModel')
const serviceModel = require('../model/serviceModel')
const userModel=require('../model/userModel')

const userList=async(req,res)=>{
    try {
        const users=await userModel.find({})
        res.json(users)
    } catch (error) {
        console.log(error)
    }
}

const addProdFarmer=(req,res)=>{
    try {
        const {prodname,imagelink,desc,mrp}=req.body
        const product=new productModel({
            userType:'farmer',
            prodname,
            imagelink,
            desc,
            quantity,
            mrp
        })
        console.log(product)
        product.save()
        res.json({msg:"product added",status:200})
    } catch (error) {
        console.log(error)
    }
}

const getProducts=async(req,res)=>{
    try {
        const products=await productModel.find({})
        res.json(products)
    } catch (error) {
        console.log(error)
    }
}
const addVideo=(req,res)=>{
    try {
        const {ytlink}=req.body
        const lastSlash=ytlink.lastIndexOf('/')
        const videoId=ytlink.slice(lastSlash+1,ytlink.length)
        console.log(videoId)
        const video=new serviceModel({ytlink:videoId})
        video.save()
        res.json("video added")
    } catch (error) {
        console.log(error)
    }
}

const deleteVideo=async(req,res)=>{
    try {
        const vId=req.params.id
        console.log(vId)
        await serviceModel.deleteOne({_id:vId})
    } catch (error) {
        console.log(error)
    }
}

const addFarmerRes=(req,res)=>{
    try {
        const {prodname,imagelink,desc,quantity,mrp}=req.body
        const product=new productModel({
            userType:'farmer',
            prodname,
            imagelink,
            desc,
            quantity,
            mrp
        })
        console.log(product)
        product.save()
        res.json({msg:"product added",status:200})
    } catch (error) {
        console.log(error)
    }
}

const orderList=async(req,res)=>{
    try {
        const orders=await orderModel.find({})
        .populate("userId")
        .populate("productId")
        res.json(orders)
    } catch (error) {
        console.log(error)
    }
}

const cartList=async(req,res)=>{
    try {
        const carts=await cartModel.find({})
        .populate("items.productId")
        res.json(carts)
    } catch (error) {
        console.log(error)
    }
}

const confirmOrder=async(req,res)=>{
    try {
        const {orderid}=req.body.data
        console.log(orderid)
        const order=await orderModel.findOne({_id:orderid})
        if(order){
           order.orderstatus='confirmed' 
           await order.save()
        }
        else{
            console.log("no order iwth this id")
        }
        
        
        res.json("success")
    } catch (error) {
        console.log(error)
    }
}

const adminProdUpdate=async(req,res)=>{
    try {
        const {editProdId,editData}=req.body.data
        const {prodname,imagelink,desc,mrp,quantity}=editData
        await productModel.updateOne({_id:editProdId},
            {prodname,imagelink,desc,mrp,quantity}
        )
        res.json("updated")
    } catch (error) {
        console.log(error)
    }
}

module.exports={userList,addProdFarmer,getProducts,addVideo,
    deleteVideo,addFarmerRes,orderList,cartList,confirmOrder,
    adminProdUpdate
}