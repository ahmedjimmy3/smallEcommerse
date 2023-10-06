const express = require('express')
const router = express.Router();
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cookie = require('cookies')

// register
router.post('/register', async (req,res)=>{
    const hashedPassword = await bcrypt.hash(req.body.password , 10)
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
    })
    try {
        const savedUser = await newUser.save();
        res.status(200).json(savedUser);
    } catch (error) {
        res.status(500).json(error);
    }
})


// login
router.post('/login', async(req,res)=>{
    try {
        const user = await User.findOne({ username:req.body.username })
        if(!user){ return res.status(401).json("Wrong credentials") }
        const originalPassword = await bcrypt.compare(req.body.password , user.password)
        if(!originalPassword){ return res.status(401).json("Wrong credentials") }

        // token
        const accessToken = jwt.sign(
            {
                id: user._id, 
                isAdmin: user.isAdmin,
            }, 
            process.env.JWT_SECRET,
            {expiresIn:"3d"}  // expiration date
        )
            res.cookie("token", accessToken , {
                httpOnly:true
            })
        // to not display password  (user._doc) because mongodb store in this file(_doc)
        const { password , ...others} = user._doc
        res.status(200).json({...others , accessToken})
    } catch (error) {
        res.status(500).json(error);
    }
})



module.exports = router