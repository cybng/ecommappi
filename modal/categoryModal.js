const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const categorySchema = new mongoose.Schema({

  name:{
    type:String,
    trim:true
  },
  slug:{
    type:String,
    unique:true,
    trim:true
  },
  parentId:{
    type:String,
    trim:true
  }

});
 
module.exports = mongoose.model("category",categorySchema);