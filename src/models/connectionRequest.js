const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref : "User", //refrence to the User collection
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref : "User",
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["ignored", "intrested", "accepted", "rejected"],
      },
    },
  },
  {
    timestamps: true,
  }
);

//made compound index
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

//to prevent , if user trying to sending request himself
connectionRequestSchema.pre("save", function (next) {
  const connectionRequest = this;
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error("Cannot send connection request to youself!!!");
  }
  next();
});

module.exports = mongoose.model("ConnectionRequest", connectionRequestSchema);
