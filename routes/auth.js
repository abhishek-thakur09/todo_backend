const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const router = express.Router();
const limit = require("../middleware/ratelimit")
require("dotenv").config();


// registering the user
router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: "user already exist" });
    }

    // convert our normal password into hashed password
    // here 10 are salt rounds which tell us about how much our password is complex to break

    const haspass = await bcrypt.hash(password, 10);

    await User.create({
      email,
      password: haspass,
    });

    res.json({ message: "User registered successfully!!" });
  } catch (error) {
    res.status(404).json(error);
  }
});

// for login the user

router.post("/login",limit, async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    // match the hash password with login pass
    const match_passs = await bcrypt.compare(password, user.password);

    if (!match_passs) {
      return res.status(401).json({ message: "invalid password" });
    }


    // jsontoken generate
    const token = jwt.sign(
        {userId: user.id},
        process.env.JWT_KEY,
        {expiresIn: "1d"}
    );


    res.cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 24*60*60*1000
    });

    res.json({ message: "User Loggedin successfully!!" });
  } catch (error) {
    res.status(404).json(error);
  }
});

module.exports = router;
