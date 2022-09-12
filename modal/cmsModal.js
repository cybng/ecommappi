const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const cmsSchema = new mongoose.Schema({

  pageTitle:{
    type:String
  },
  pageContent:{
    type:String
  }

},{timestamps:true})
 

 

module.exports = mongoose.model("cms",cmsSchema);