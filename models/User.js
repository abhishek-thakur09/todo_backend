// for making user schema first we have to require mongoose
const mongoose = require("mongoose");

// user schema

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required: true,
        unique: true // bcz sbhi users ka email same nahi hoga
    },
    password:{
        type: String,
        required: true,
    },
    name:{
        type:String,
    }

}, {timestamps: true});

module.exports = mongoose.model("User", userSchema);