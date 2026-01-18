// for making team schema first we have to require mongoose
const mongoose = require("mongoose");

// team schema

const teamSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true,
    },
    // who created the team that person id is here
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
   members:[
    {
        // team members id
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
   ]

}, {timestamps: true});

module.exports = mongoose.model("Team", teamSchema);