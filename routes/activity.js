
const express = require("express");
const router = express.Router();
const Activity = require("../models/Activity");
const authmiddleware = require("../middleware/authmiddleware");


router.get("/:teamId", authmiddleware, async(req,res)=>{
    const activites = await Activity.find({teamId: req.params.teamId})
    .populate("createdBy", "email");
    
    res.json(activites);
})


module.exports =  router;