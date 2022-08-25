const mongoose=require('mongoose');
require("dotenv").config();
const connectDb = async () => {
    console.log(process.env.URL)
  try {
    await mongoose.connect(process.env.URL);
    
    console.log("db is successfuly connected");
  } catch (error) {
    console.log("connection to db is failed ");
  }
};
module.exports=connectDb