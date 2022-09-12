const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const couponSchema = new mongoose.Schema({

  couponCode:{
    type:String
  },
  couponDescription:{
    type:String
  },
  couponType:{
    type:String
  },
  couponUsage:{
    type:String
  },
  couponExpire:{
    type:String
  },
  status:{
    type:String,
    default:"active"
  },
  indivisualUse:{
    type:String,
  },
  excludeUse:{
    type:String,
  },
  couponPrice:{
    type:String,
  },
  productList:{
    type:Array,
  }

},{timestamps:true})
 

 

module.exports = mongoose.model("coupon",couponSchema);