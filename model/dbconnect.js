const mongoose=require('mongoose')
require('dotenv').config()

const dbconnect=async()=>{
    try {
        await mongoose.connect(process.env.mongo_url,{
            useNewUrlParser:true,
            useUnifiedTopology:true,
        });
        console.log('database connection successful')
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

module.exports=dbconnect