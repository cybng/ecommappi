const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const vendorImageSchema = new mongoose.Schema({

  vendorEmail:{
    type:String
  }, 
  vendorImage:{
    type:Array
  }, 

},{timestamps:true})
 

 

module.exports = mongoose.model("vendorimage",vendorImageSchema);