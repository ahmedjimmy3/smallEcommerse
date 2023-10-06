const express = require('express')
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const userRoute = require('./routes/user')
const { urlencoded } = require('body-parser')
const authMethods = require('./routes/auth')
const productsRoute = require('./routes/product')
const cartRoute = require('./routes/cart') 
const orderRoute = require('./routes/order')

// secret url of database in the .env file 
dotenv.config();

// connect to database 
mongoose.connect(process.env.MONGOURL)
.then(()=>{
    console.log("DB connected successfully")
}).catch((err)=>{
    console.log("DB failed connection");
})


app.use(express.json())
app.use(urlencoded({extended:false}))
app.use('/user', userRoute)
app.use('/auth' , authMethods)
app.use('/product' , productsRoute)
app.use('/cart' , cartRoute)
app.use('/order' , orderRoute)



const PORT = 3000 || process.env.PORT
app.listen(PORT , ()=>{
    console.log(`Application listening on port = ${PORT} `);
})