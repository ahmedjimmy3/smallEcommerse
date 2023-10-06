const express = require('express')
const router = express.Router();
const {verifyToken , verifyTokenAndAuthorization, verifyTokenAndAdmin} = require('./verifyToken')
const bcrypt = require('bcrypt')
const User = require('../models/user')


router.put('/:id',verifyTokenAndAuthorization, async(req,res)=>{
    if(req.body.password){
        req.body.password = await bcrypt.hash(req.body.password , 10)
    }
    try {
        const updatedUser = await User.findByIdAndUpdate(
                req.params.id ,
                {
                    $set:req.body,
                },
                { new: true}
            )
        res.status(200).json(updatedUser)
    } catch (error) {
        res.status(500).json(error)
    }
})

// delete user
router.delete('/:id' , verifyTokenAndAuthorization , async (req,res)=>{
    try {
        await User.findByIdAndDelete(req.params.id)
        res.status(200).json("User deleted successfully..")
    } catch (error) {
        res.status(500).json(error)
    }
})


// get user
router.get('/:id', verifyTokenAndAdmin  , async (req,res)=>{
    try {
        const user = await User.findById(req.params.id)
        const {password , ...others} = user._doc
        res.status(200).json(others)
    } catch (error) {
        res.status(500).json(error)
    }
})

// get all users
router.get('/', verifyTokenAndAdmin  , async (req,res)=>{
    // lw write query in header y retrieve latest 5 users only
    const query = req.query.new
    try {
        const users = query ? await User.find().sort({ _id: -1 }).limit(5) :  await User.find()
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json(error)
    }
})


// get user stats
router.get('/stats', verifyTokenAndAdmin, async (req, res) => {
    const date = new Date()
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

    try {
        const data = await User.aggregate([
            { $match: { createdAt: { $gte: lastYear } } },
            {
                $project: {
                    month: { $month: "$createdAt" },
                },
            },
            {
                $group: {
                    _id: "$month",
                    total: { $sum: 1 },
                },
            }
        ]);
        res.status(200).json(data);
    } catch (error) {
        console.error("Error in /stats route:", error);
        res.status(500).json({ error: "An error occurred while fetching stats" });
    }
});


module.exports = router