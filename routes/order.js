const express = require('express')
const router = express.Router();
const {verifyToken , verifyTokenAndAuthorization, verifyTokenAndAdmin} = require('./verifyToken')
const bcrypt = require('bcrypt')
const Order = require('../models/order');

// create order
router.post('/',verifyToken , async(req,res)=>{
    const newOrder= new Order( req.body )
    try {
        const savedOrder = await newOrder.save()
        res.status(200).json(savedOrder)
    } catch (error) {
        res.status(500).json(error)
    }
})


// update order
router.put('/:id',verifyTokenAndAdmin, async(req,res)=>{
    try {
        const updatedOrder = await Order.findByIdAndUpdate(
                req.params.id ,
                {
                    $set:req.body,
                },
                { new: true}
            )
        res.status(200).json(updatedOrder)
    } catch (error) {
        res.status(500).json(error)
    }
})

// delete order
router.delete('/:id' , verifyTokenAndAdmin , async (req,res)=>{
    try {
        await Order.findByIdAndDelete(req.params.id)
        res.status(200).json("Order deleted successfully..")
    } catch (error) {
        res.status(500).json(error)
    }
})


// get user orders
router.get('/:userId' ,verifyTokenAndAuthorization ,async (req,res)=>{
    try {
        const orders = await Order.find({userId: req.params.userId})
        res.status(200).json(orders)
    } catch (error) {
        res.status(500).json(error)
    }
})

// get all orders
router.get('/' , verifyTokenAndAdmin , async(req,res)=>{
    try {
        const orders = await Order.find()
        res.status(200).json(orders)
    } catch (error) {
        res.status(500).json(error)
    }
})


// get monthly encome
router.get('/income', verifyTokenAndAdmin,async (req,res)=>{
    const date = new Date()
    const lastMonth = new Date(date.setMonth(date.getMonth()-1))
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth()-1))

    try {
        
        const income = await Order.aggregate([
            {$match:{createdAt:{$gte: previousMonth}}},
            {
                $project:{
                    month:{$month:"createdAt"},
                    sales:"$amount",
                },
            },
            {
                $group:{
                    _id:"$month",
                    total:{$sum: "$sales"}
                },
            },
        ])
        res.status(200).json(income)
    } catch (error) {
        res.status(500).json(error)
    }
})




module.exports = router
