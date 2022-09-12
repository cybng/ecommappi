const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema({

  item_code:{
    type:String
  },
  variant:{
    type:String
  },
  variant_desctiption:{
    type:String
  },
  variant_order:{
    type:String
  },
  vendor:{
    type:String
  },
  stock_quantity:{
    type:String
  },

},{timestamps:true})
 

 

module.exports = mongoose.model("stock",userSchema);