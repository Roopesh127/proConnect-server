const express = require("express");
const profileRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    // const userObj = user.toObject();
    // res.send(userObj)
    res.send(user);
  } catch (err) {
    res.status(400).send("Error :" + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("invalid edit request !!!!");
    }
    const loggedInUser = req.user;

    // console.log("Edit request body:", req.body);

    // loggedInUser.firstName = req.body.firstName;
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    await loggedInUser.save();

  //  res.send("User updated successfully!!!!");
   res.json({
    message : `${loggedInUser.firstName} , your profile updated successfully!!!`,
    data : loggedInUser
   })
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
});

module.exports = profileRouter;
