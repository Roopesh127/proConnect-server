const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 50,
      index: true,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      lowercase: true,
      required: true,
      unique: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email address : " + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Password must be strong :" + value);
        }
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      // validate(value){
      //     if(!["male","female","others"].includes(value)){
      //         throw new Error("gender data is not valid.")
      //     }
      // }
      enum: {
        values: ["male", "female", "other"],
        message: `{VALUE}, is not a valid gender type!!`,
      },
    },
    photoUrl: {
      type: String,
      default: "https://static.thenounproject.com/png/4154905-200.png",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("url is not correct :" + value);
        }
      },
    },
    about: {
      type: String,
      default: "this is default message from user!!!!!",
    },
    skills: {
      type: [String],
    },
  },
  { timestamps: true }
);

//compound index
userSchema.index({ firstName: 1, lastName: 1 });

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "DEV@Tinder$790", {
    expiresIn: "1d",
  });
  return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const passwordHash = user.password;
  isPasswordvalid = await bcrypt.compare(passwordInputByUser, passwordHash);
  return isPasswordvalid;
};

module.exports = mongoose.model("User", userSchema);
