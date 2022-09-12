const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
var aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const xlsSchema = new mongoose.Schema({

  email:{
    type:String
  },
  description:{
    type:Array
  },
  stock:{
    type:Array
  }

},{timestamps:true})
 

 xlsSchema.plugin(aggregatePaginate); //second step

module.exports = mongoose.model("xls",xlsSchema);