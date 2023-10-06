const express = require('express')
const router = express.Router();
const {verifyToken , verifyTokenAndAuthorization, verifyTokenAndAdmin} = require('./verifyToken')
const bcrypt = require('bcrypt')
const Cart = require('../models/cart');

// create cart
router.post('/',verifyToken , async(req,res)=>{
    const newCart= new Cart( req.body )
    try {
        const savedCart = await newCart.save()
        res.status(200).json(savedCart)
    } catch (error) {
        res.status(500).json(error)
    }
})


// update cart
router.put('/:id',verifyTokenAndAuthorization, async(req,res)=>{
    try {
        const updatedCart = await Cart.findByIdAndUpdate(
                req.params.id ,
                {
                    $set:req.body,
                },
                { new: true}
            )
        res.status(200).json(updatedCart)
    } catch (error) {
        res.status(500).json(error)
    }
})

// delete Cart
router.delete('/:id' , verifyTokenAndAuthorization , async (req,res)=>{
    try {
        await Cart.findByIdAndDelete(req.params.id)
        res.status(200).json("Cart deleted successfully..")
    } catch (error) {
        res.status(500).json(error)
    }
})


// get user Cart
router.get('/:userId' ,verifyTokenAndAuthorization ,async (req,res)=>{
    try {
        const cart = await Cart.findOne({userId: req.params.userId})
        res.status(200).json(cart)
    } catch (error) {
        res.status(500).json(error)
    }
})

// get all
router.get('/' , verifyTokenAndAdmin , async(req,res)=>{
    try {
        const carts = await Cart.find()
        res.status(200).json(carts)
    } catch (error) {
        res.status(500).json(error)
    }
})



module.exports = router