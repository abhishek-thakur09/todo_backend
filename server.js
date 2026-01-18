const express = require("express");
const mongoDb = require("./utils/database");
const cookieParser = require("cookie-parser");
require("dotenv").config();



const app = express();
app.use(express.json());
app.use(cookieParser());



const authroute = require("./routes/auth");
const teamroute = require("./routes/team");
const taskroute = require("./routes/task");
const activityroute = require("./routes/activity");


// api routes
app.use("/auth", authroute);
app.use("/teams", teamroute);
app.use("/tasks", taskroute);
app.use("/activity", activityroute)




app.listen(3333, async()=>{
    await mongoDb();
    console.log("server is running on the port 3333");
})