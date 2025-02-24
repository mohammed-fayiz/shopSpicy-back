const mongoose=require('mongoose')

const serviceSchema=new mongoose.Schema({
    ytlink:{type:String},
},{timestamps:true})

const serviceModel=new mongoose.model("serviceLinks",serviceSchema)

module.exports=serviceModel