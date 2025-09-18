const express = require("express");
const requestRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const connectionRequest = require("../models/connectionRequest");

//for send connection request.
requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      // find sender name
      const senderName = await User.findById(fromUserId);

      //find reciever name
      const recieverName = await User.findById(toUserId);
      // console.log("senderName", senderName.firstName);
      // console.log("recieverName", recieverName.firstName);

      // not able to go out of status.
      const allowedStatus = ["ignored", "intrested"];
      if (!allowedStatus.includes(status)) {
        throw new Error("status type is not allowed!!!!!!");
      }

      // if user trying to send request himself. # currently handle this edge cases through middleware inside schema file
      // if(toUserId == fromUserId){
      //   throw new Error(`Dear, ${req.user.firstName} why you try to send request yourself , I am not fool.`)
      // }

      // if user trying to send request out of DB.
      const toUser = await User.findById(toUserId);
      if (!toUser) {
        throw new Error("User not found!!!!");
      }

      //if is there existing connection request.
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
          { fromUserId: fromUserId, toUserId: toUserId },
        ],
      });

      if (existingConnectionRequest) {
        throw new Error("connection request is already exist !!!!!!");
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();

      res.json({
        message: `Hello ${senderName.firstName}, you ${status} to ${recieverName.firstName} profile.`,
        data,
      });
    } catch (err) {
      res.status(400).send("ERROR : " + err.message);
    }
  }
);

// for review(accept/reject) connection request.
requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;

      //validate the status
      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "this status is not allowed!!!!!" });
      }

      //roopesh => sheetal
      //status = "intrested"
      //requestId should be valid
      const request = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "intrested",
      });
      if (!request) {
        return res.status(400).json({ message: "User is not valid!!!!!" });
      }

      request.status = status;

      const data = await request.save();
      res.json({ message: "Connection request" + status, data });
    } catch (err) {
      res.status(400).send("ERROR : " + err.message);
    }
  }
);

module.exports = requestRouter;
