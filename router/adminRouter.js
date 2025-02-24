const express=require('express')
const { userList, addProdFarmer, getProducts, addVideo, deleteVideo, addFarmerRes, orderList, cartList, confirmOrder, adminProdUpdate } = require('../cotnroller/adminCtrl')

const adminRouter=express.Router()

adminRouter.route('/userlist').get(userList)
adminRouter.route('/addprodfarmer').post(addProdFarmer)
adminRouter.route('/getproducts').get(getProducts)
adminRouter.route('/addvideo').post(addVideo)
adminRouter.route('/deletevideo/:id').delete(deleteVideo)
adminRouter.route('/addfarmerres').post(addFarmerRes)
adminRouter.route('/orderlist').get(orderList)
adminRouter.route('/cartlist').get(cartList)
adminRouter.route('/confirmorder').post(confirmOrder)
adminRouter.route('/adminprodupdate').put(adminProdUpdate)


module.exports=adminRouter