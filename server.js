const express=require('express')
const app=express()

const cors=require('cors')
app.use(cors())

app.use(express.urlencoded({extended:true}))
app.use(express.json())

require('dotenv').config()
app.listen(process.env.PORT,()=>{
    console.log("http://localhost:9000")
})

const dbconnect=require('./model/dbconnect')
dbconnect()

const userRouter = require('./router/userRouter')
app.use('/user',userRouter)
const adminRouter = require('./router/adminRouter')
app.use('/admin',adminRouter)

const path=require('path')

app.use('/uploads',express.static(path.join(__dirname,'uploads')))