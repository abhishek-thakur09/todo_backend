const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
    action:{
        type: String,
        required: true
    },
    taskId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task"
    },
    teamId:{
         type: mongoose.Schema.Types.ObjectId,
        ref: "Team"
    },
    createdBy:{
         type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }

}, {timestamps: true});

module.exports = mongoose.model("Activity", activitySchema)