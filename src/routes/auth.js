const express = require("express");
const authRouter = express.Router();
const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");

authRouter.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req); //validation

    const {
      firstName,
      lastName,
      emailId,
      password,
      gender,
      age,
      photoUrl,
      about,
      skills,
    } = req.body; //iterating data

    //encrypting password
    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      //inserting data
      firstName,
      lastName,
      emailId,
      password: passwordHash,
      age,
      gender,
      photoUrl,
      about,
      skills,
    });

    // if (req.body.skills.length > 10) {
    //   throw new Error("Skills not greater than 10");
    // }

    // if (Array.isArray(req.body.skills) && req.body.skills.length > 10) {
    //   throw new Error("Skills not greater than 10");
    // }

    

    const savedUser = await user.save();

    const token = await savedUser.getJWT();
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 36000000),
      });
    
    res.json({ message: "User Added sucessfully!!", data: savedUser });
  } catch (err) {
    res.status(400).send("There is error occured in your code :" + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId }); //check email is available in DB or not????
    if (!user) {
      // throw new Error("email is not available");
      return res.status(404).json({ message: "Email is not registered" });
    }

    let isPasswordvalid = await user.validatePassword(password); //now checking password is available in DB or not????

    if (!isPasswordvalid) {
      // return new Error("Password is not available");
      return res.status(404).json({ message: "Invalid password" });
    }

    if (isPasswordvalid) {
      const token = await user.getJWT();
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 36000000),
      });
      // res.status(200).send(`${user.firstName} ,Loged in Successfully!!!!!!!`);
      res.status(200).send(user);
    }
  } catch (err) {
    res.status(400).send("Error :" + err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.send("Logout successfully!!!!!!");
});

module.exports = authRouter;
