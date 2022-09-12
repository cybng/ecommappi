const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema({

  fname:{
  	type:String,
  	trim:true,
  	min:4,
  	max:20,
  	required:true
  },
  lname:{
  	type:String,
  	trim:true,
  	min:4,
  	max:20,
  	required:true
  },
  username:{
  	type:String,
  	trim:true,
  	min:4,
  	max:20,
    default:null
  },
  email:{
  	type:String,
  	trim:true,
  	min:4,
  	max:20,
  	required:true
  },
  businessName:{
    type:String
  },
  businessNumber:{
    type:String
  },
  businessType:{
    type:String
  }, 
  phoneNumber:{
    type:String
  },
  address:{
    type:String
  },
  city:{
    type:String
  },
  dateOfBirth:{
    type:String
  },
  gender:{
    type:String
  },
  hashPassword:{
    type:String
  }, 
  role:{
  	type:String,
  	trim:true,
  	min:4,
  	max:20,
  	enum:["Buyer","Vendor","Admin"],
  	default:null,
  	required:true
  },
  status:{
    type:String,
    trim:true,
    min:4,
    max:20,
    enun:["active","block"],
    default:"active",
    required:true
  },
  otp:{
    type:String,
    trim:true,
    min:6,
    max:6,
    default:null,
    required:true
  } 

},{timestamps:true})

userSchema.virtual("fullname").get(()=>{
return(`${this.fname} ${this.lname}`);
});

userSchema.methods = {
	authenticate : async function(password){ 
		 return await bcrypt.compare(password,this.hashPassword);
	}
}

module.exports = mongoose.model("user",userSchema);