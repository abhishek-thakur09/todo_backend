const express = require("express");
const Team = require("../models/Team");
const User = require("../models/User");
const Task = require("../models/Task");
const cache = require("../utils/cache");
const authmiddleware = require("../middleware/authmiddleware");

const router = express.Router();

// now create the team

router.post("/create", authmiddleware, async (req, res) => {
  // before making the team check that is there any user which created the same team again or not
  try {
    const checkteam = await Team.findOne({
      name: req.body.name,
      createdBy: req.userId,
    });

    if (checkteam) {
      return res.status(400).json({
        message: "already have a team with this same name",
      });
    }

    // otherwise create the team

    const team = await Team.create({
      name: req.body.name,
      createdBy: req.userId,
      members: [req.userId],
    });

    // here we see our mambers with there email ids
    const teammemberdata = await Team.findById(team._id)
      .populate("createdBy", "email")
      .populate("members", "email");

    res.json(teammemberdata);
  } catch (error) {
    res.status(400).json({ message: "please try again!" });
  }
});





// view my all teams present in db
router.get("/my-teams",authmiddleware, async(req, res)=>{
  const teams = await Team.find({members: req.userId}).populate(
    "members",
    "email"
  );
  
  if(teams.length === 0){
    return  res.status(404).json({message: "there are no teams"})
  }
  
  res.json(teams);
} )





// creating api for pagination + search + filter
router.get("/:teamId/tasks", authmiddleware, async (req, res) => {
  try {
    const { teamId } = req.params;
    const { page = 1, limit = 5, search = "", assignedTo = "" } = req.query;

    const filter = { teamId };

    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }

    if (assignedTo) {
      filter.assignedTo = assignedTo;
    }

    const skip = (page - 1) * limit;

    const cacheKey = `tasks_${teamId}_p${page}_l${limit}_s${search}_a${assignedTo}`;

    // CACHE HIT
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      console.log("Serving from cache");
      return res.json(cachedData);
    }

    const totalTasks = await Task.countDocuments(filter);

    const tasks = await Task.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate("assignedTo", "email");

    const response = {
      totalTasks,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalTasks / limit),
      tasks,
    };

    // STORE CACHE
    cache.set(cacheKey, response);

    res.json(response);

  } catch (error) {
    res.status(500).json({ message: "failed to fetch tasks" });
  }
});





// add team members
router.post("/add-member/:teamId", authmiddleware, async (req, res) => {
  try {
    const team = await Team.findById(req.params.teamId);
    if (team.createdBy.toString() !== req.userId) {
      return res
        .status(403)
        .json({
          message: "only creator or loggedin user who is head can add members",
        });
    }
    const user = await User.findOne({ email: req.body.email });
   
   
  //  check weather the user is already in the team or not
    if(user._id == team.createdBy.toString()){
      return res.status(400).json("you are already in the team!");
    }
    team.members.push(user._id);
    await team.save();

    res.json({ message: "Member added successfully!!" });
  } catch (error) {
    res.status(404).json(message, error.message);
  }
});


// remove team members
router.delete("/remove-member/:teamId", authmiddleware, async (req, res) => {
  try {
    const team = await Team.findById(req.params.teamId);
    if(!team){
       return res
        .status(404)
        .json({
          message: "Team not found!!",
        });
    }
    if (team.createdBy.toString() !== req.userId) {
      return res
        .status(403)
        .json({
          message: "only creator or loggedin user who is head can add members",
        });
    }
    const user = await User.findOne({ email: req.body.email });
    if(!user){
       return res
        .status(404)
        .json({
          message: "User not found",
        });
    }
    team.members.pull(user._id);
    await team.save();
    res.json({ message: "Member removed successfully!!" });
  } catch (error) {
    res.status(404).json(message, error.message);
  }
});

module.exports = router;
