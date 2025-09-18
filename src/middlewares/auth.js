const jwt = require("jsonwebtoken");
const User = require("../models/user")

const userAuth = async (req,res,next)=>{
    try{
      const{token} = req.cookies; //read the token from request
      if(!token){
        // throw new Error("Token is not valid !!!!!")
        return res.status(401).send("Sorry Bro you are unautheriozed , Please LOGIN!!!!")
      }
      const decodeObj = await jwt.verify(token,"DEV@Tinder$790");

      const{_id} = decodeObj;

      const user = await User.findById(_id);
      if(!user){
        throw new Error("User not found");
      }
      req.user = user;
      next();
    }
    catch(err){
        res.status(400).send("ERROR : " + err.message)
    }
}

module.exports = {
    userAuth,
}