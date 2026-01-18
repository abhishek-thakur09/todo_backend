const express = require("express");
const Task = require("../models/Task");
const authmiddleware = require("../middleware/authmiddleware");
const Activity = require("../models/Activity");
const Team = require("../models/Team");
const router = express.Router();
const cache = require("../utils/cache");




// create a task for our team so we need team id here
router.post("/create/:teamId", authmiddleware, async (req, res) => {
  try {
    const task = await Task.create({
      title: req.body.title,
      description: req.body.description,
      teamId: req.params.teamId,
      createdBy: req.userId,
    });

    // ACTIVITY LOGS for creating the task
    await Activity.create({
      action: "TaskCreated",
      taskId: task._id,
      teamId: task.teamId,
      performedBy: req.userId,
    });

    // clear cache
    Object.keys(cache).forEach((key) => {
      if (key.startsWith(`tasks_${req.params.teamId}`)) {
        delete cache[key];
      }
    });

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// update the existing task so we need task id for it and check that is there any task or not
router.patch("/update/:taskId", authmiddleware, async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.taskId,
      {
        title: req.body.title,
        description: req.body.description,
      },
      { new: true },
    );

    if (!task) {
      return res.status(400).json({ message: "task not found" });
    }
    await task.save();

    // ACTIVITY LOGS for Updating the task
    await Activity.create({
      action: "TaskUpdated",
      taskId: task._id,
      teamId: task.teamId,
      performedBy: req.userId,
    });

    // clear cache
    Object.keys(cache).forEach((key) => {
      if (key.startsWith(`tasks_${task.teamId}`)) {
        delete cache[key];
      }
    });

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// delete the existing task so we need task id for it and check that is there any task or not
router.delete("/delete/:taskId", authmiddleware, async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(
      req.params.taskId,
      {
        title: req.body.title,
      },
      { new: true },
    );

    if (!task) {
      return res.status(400).json({ message: "task not found" });
    }

    // clear cache
    Object.keys(cache).forEach((key) => {
      if (key.startsWith(`tasks_${task.teamId}`)) {
        delete cache[key];
      }
    });

    res.json({ message: "your task is deleted successfully!!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// move the existing task from its status [TODO, DOING, DONE]
//  so we need task id for it and check that is there any task or not
router.put("/move/:taskId", authmiddleware, async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    task.status = req.body.status;

    if (!task) {
      return res.status(400).json({ message: "task not found" });
    }
    await task.save();

    // ACTIVITY LOGS for MOVE the task
      await Activity.create({
      action: "TaskMove",
      taskId: task._id,
      teamId: task.teamId,
      performedBy: req.userId,
    });

    // clear cache
    Object.keys(cache).forEach((key) => {
      if (key.startsWith(`tasks_${task.teamId}`)) {
        delete cache[key];
      }
    });

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Assigned different tasks to different users
router.put("/assign/:taskId", authmiddleware, async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    task.assignedTo = req.body.userId;

    if (!task) {
      return res.status(400).json({ message: "task not found" });
    }
    await task.save();
    // ACTIVITY LOGS for Assign the task
    await Activity.create({
      action: "TaskAssigned",
      taskId: task._id,
      teamId: task.teamId,
      performedBy: req.userId,
    });

    // clear cache
    Object.keys(cache).forEach((key) => {
      if (key.startsWith(`tasks_${task.teamId}`)) {
        delete cache[key];
      }
    });

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// comments on the spcific task
router.post("/comment/:taskId", authmiddleware, async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    task.comments.push({
      text: req.body.text,
      createdBy: req.userId,
    });
    if (!task) {
      return res.status(400).json({ message: "task not found" });
    }
    await task.save();

    // ACTIVITY LOGS for comment the task
      await Activity.create({
      action: "TaskComment",
      taskId: task._id,
      teamId: task.teamId,
      performedBy: req.userId,
    });

    // clear cache
    Object.keys(cache).forEach((key) => {
      if (key.startsWith(`tasks_${task.teamId}`)) {
        delete cache[key];
      }
    });

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
