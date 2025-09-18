const mongoose = require("mongoose");

const connectDB = async() =>{
    await mongoose.connect("mongodb+srv://roopeshvish2006:9302017774@cluster1.lp2vwp1.mongodb.net/devTinder")
}
module.exports = connectDB;
