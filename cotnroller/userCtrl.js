const userModel=require('../model/userModel')
const argon2=require('argon2')
const jwt=require('jsonwebtoken')
const serviceModel = require('../model/serviceModel')
const productModel = require('../model/productModel')
const orderModel = require('../model/orderModel')
const cartModel = require('../model/cartModel')

const regUser=async(req,res)=>{
    try {
        const {username,email,mobile,userType,password}=req.body
        const user=await userModel.findOne({email:email})
        if(user){
            res.json("user exist")
        }
        else{
            // const salt=10
            const hashPassword=await argon2.hash(password)
            const user=new userModel({
                username,
                email,
                mobile,
                userType,
                password:hashPassword,
                isActive:'active'
            })
            await user.save()
            res.json("User Registered")
        }
    } catch (error) {
        console.log(error)
    }
}

const logUser=async(req,res)=>{
    try {
        const {email,password}=req.body
        const user=await userModel.findOne({email:email})
        if(!user){
            res.json({msg:"user not found",status:300})
        }
        else{
            const x=await argon2.verify(user.password,password)
            
            if(x && user.isActive=='active'){
                const token=jwt.sign({data:user},'shopspicy',{expiresIn:'1h'})
                res.json({msg:"login Successfull",token:token,status:200})
                
            }
            else{
                res.json({msg:"wrong password",status:200})
            }
        }
    } catch (error) {
        console.log(error)
    }
}

const getVideo=async(req,res)=>{
    try {
        const ytlinks=await serviceModel.find({})
        res.json(ytlinks)
    } catch (error) {
        console.log(error)
    }
}

const getProdSellFarm=async(req,res)=>{
    try {
        const products=await productModel.find({})
        res.json(products)
    } catch (error) {
        console.log(error)
    }
}

const farmerSellOrder=async(req,res)=>{
    try {
        const {userId,productId,orderData}=req.body.data
        const {quantity,landmark,pincode,city,state}=orderData
        let order=await orderModel.findOne({productId:productId})
        let product=await productModel.findOne({_id:productId})
        if(order){
            const newQuantity=Number(order.quantity)+Number(quantity)
            product.quantity=newQuantity
            order=new orderModel({
                userId,productId,cartId:null,quantity,landmark,pincode,city,state,orderstatus:'pending'
            })
            await order.save()
            await product.save()
            res.json({status:order.orderstatus,msg:"order placed"})
        }
        else{
            order=new orderModel({
                userId,productId,cartId:null,quantity,landmark,pincode,city,state,orderstatus:'pending'
            })
            await order.save()
            res.json({status:order.orderstatus,msg:"order placed"})
        }
        console.log(quantity,landmark,pincode,city,state)
    } catch (error) {
        console.log(error)
    }
}

const farmerAddToCart=async(req,res)=>{
    try {
        const {userId,productId,quantity}=req.body.data
        let cart=await cartModel.findOne({userId:userId})
        if(cart){
            const itemIndex=cart.items.findIndex(item=>item.productId==productId)
            console.log(itemIndex)
            if(itemIndex>-1){
                cart.items[itemIndex].quantity+=quantity
                // await change.save()
            }
            else{
                cart.items.push({productId,quantity})
            }
            await cart.save()
            res.json({msg:'added to cart'})
            
        }
        else{
            cart=new cartModel({
                userId,
                items:[{
                    productId,quantity
                }]
            })
            await cart.save()
        }
    } catch (error) {
        console.log(error)
    }
}

const farmerViewCart=async(req,res)=>{
    try {
        const userId=req.headers.userid
        const cart=await cartModel.findOne({userId:userId})
        .populate("items.productId")
        res.json(cart)
    } catch (error) {
        console.log(error)
    }
}

const removeCart=async(req,res)=>{
    const {userId,cartId,productId}=req.body
    try {
        const cart=await cartModel.findOne({userId:userId})
        if(cart){
            const itemIndex=cart.items.findIndex((item)=>item.productId==productId)
            if(itemIndex>-1){
                cart.items.splice(itemIndex,1)
                await cart.save();
                res.json({msg:"cart item removed"}).status(200)
            }
            else{
                res.json({msg:"itemnot removed"}).status(404)
            }
        }
        else{
            res.json({msg:"cart not found"}).status(404)
        }
    } catch (error) {
        console.log(error)
        res.json("error occured").status(500)
    }
}

const getOrderDetails=async(req,res)=>{
    try {
        const userId=req.headers.userid
        const orders=await orderModel.find({})
        .populate("productId")
        res.json(orders)
    } catch (error) {
        console.log(error)
    }
}

const getOrderDetailsWhole=async(req,res)=>{
    try {
        const orders=await orderModel.find({})
        .populate("userId")
        .populate("productId")
        res.json(orders)
    } catch (error) {
        console.log(error)
    }
}

const farmerBuyOrder=async(req,res)=>{
    try {
        const {userId,cartId,location}=req.body.data
        const {landmark,pincode,city,state}=location
        let order=await orderModel.findOne({cartId:cartId})
        
        console.log(userId,cartId,landmark,pincode,city,state)
        if(order){
            res.json({msg:"order exist"})
        }
        else{
            order=new orderModel({userId,cartId,productId:null,landmark,pincode,city,state,orderstatus:'pending'})
            await order.save()
            res.json({msg:"order placed"})
        }
    } catch (error) {
        console.log(error)
    }
}

const wholePlaceOrder=async(req,res)=>{
    try {
        
        const {count,orderId,userId}=req.body.data
        let order=await orderModel.findOne({userId:userId})
        const oldOrder=await orderModel.findOne({_id:orderId})
        let sellerUser=await userModel.findOne({_id:oldOrder.userId})
        let product=await productModel.findOne({_id:oldOrder.productId})
        console.log(oldOrder.productId,'prod')
        let name=''
        if(order){
            res.json({msg:"order exist"})
        }
        else{
            if(count>product.quantity){
                    
            name=sellerUser.username
            order=new orderModel({
                userId,cartId:null,productId:oldOrder.productId,landmark:oldOrder.landmark,pincode:oldOrder.pincode,city:oldOrder.city,state:oldOrder.state,quantity:count,orderstatus:'pending'
            })
            
            product.quantity-=count
            oldOrder.quantity-=count
            await oldOrder.save()
            await product.save()
            await order.save()
            res.json({msg:'added'})
            }
            else{
                res.json({msg:"not enough product"})
            }
        }
        console.log(order,name)
        
    } catch (error) {
        console.log(error)
    }
}

const wholeAddProduct=async(req,res)=>{
    try {
        console.log(req.body)
        const {userType,sendData}=req.body.data
        const {prodname,imagelink,desc,mrp,quantity}=sendData
        let product=await productModel.findOne({prodname:prodname})
        if(product){
            res.json("product exist already")
        }
        else{
            product=new productModel({
                userType,prodname,imagelink,desc,mrp,quantity
            })
            await product.save()
            res.json('Product Added')
        }
        
    } catch (error) {
        console.log(error)
    }
}

const getWholeProduct=async(req,res)=>{
    try {
        const products=await productModel.find({})
        console.log(products)
        res.json(products)
    } catch (error) {
        console.log(error)
    }
}

const wholeDeleteProduct=async(req,res)=>{
    try {
        const productId=req.params.id
        await productModel.deleteOne({_id:productId})
        res.json("Product deleted")
        console.log(productId)
    } catch (error) {
        console.log(error)
    }
}

const wholeProdUpdate=async(req,res)=>{
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

const getRetailerOrder=async(req,res)=>{
    try {
        const userId=req.headers.userid
        const order=await orderModel.findOne({userId:userId})
        
        .populate("userId")
        .populate("cartId")
        res.json(order)
    } catch (error) {
        console.log(error)
    }
}

const wholeUsersList=async(req,res)=>{
    try {
        const users=await userModel.find({userType:'retailer'})
        res.json(users)
    } catch (error) {
        console.log(error)
    }
}

const deleteAccount=async(req,res)=>{
    try {
        const {userId}=req.body.data
        console.log(userId)
        let user=await userModel.findOne({_id:userId})
        user.isActive="inactive"
        await user.save()
    } catch (error) {
        console.log(error)
    }
}

module.exports={regUser,logUser,getVideo,getProdSellFarm,farmerSellOrder,
    farmerAddToCart,farmerViewCart,removeCart,getOrderDetails,farmerBuyOrder,
    getOrderDetailsWhole,wholePlaceOrder,wholeAddProduct,getWholeProduct,
    wholeDeleteProduct,wholeProdUpdate,getRetailerOrder,wholeUsersList,deleteAccount
    
}
