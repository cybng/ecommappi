const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema({

name:{
  type:String
},
item_code:{
  type:String
},
description:{
  type:String
},
retail_unite_of_meassure:{
  type:String
},
regular_price:{
  type:String
},
sale_price:{
  type:String
},
tax_class:{
  type:String
},
dimensions:{
  type:String
},
color:{
  type:String
},
age:{
  type:String
},
brand:{
  type:String
},
stock_status:{
  type:String
},
vendor:{
  type:String
},
product_manufacturer_code:{
  type:String
},
product_cat:{
  type:String
},
properties:{
  type:String
},
properties_en:{
  type:String
},
composition:{
  type:String
},
composition_en:{
  type:String
},
components:{
  type:String
},
components_en:{
  type:String
},
collectionn:{
  type:String
},
ordering:{
  type:String
},
origine:{
  type:String
},
images:{
  type:Array
},
tag:{
  type:String
},
tae:{
  type:String
},

},{timestamps:true})
 

 

module.exports = mongoose.model("description",userSchema);