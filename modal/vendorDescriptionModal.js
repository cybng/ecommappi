const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const vendorStockSchema = new mongoose.Schema({
  email:{
    type:String
  },
  role:{
    type:String
  },

// Old Schema Modal
  // Store_Code  :{
  //   type:String
  // },
  // Store_Name  :{
  //   type:String
  // },
  // Item_Full_Code  :{
  //   type:String
  // },
  // Item_Code :{
  //   type:String
  // },
  // Color_Code  :{
  //   type:String
  // },
  // Season  :{
  //   type:String
  // },
  // Item_Color_Value  :{
  //   type:String
  // },
  // Item_description_AL :{
  //   type:String
  // },
  // Item_description_EN :{
  //   type:String
  // },
  // Item_Gender_Value :{
  //   type:String
  // },
  // Item_Category_Value :{
  //   type:String
  // },
  // Item_Composition_Value_EN :{
  //   type:String
  // },
  // Item_Dimension_Value  :{
  //   type:String
  // },
  // Item_Collection_Code_COL  :{
  //   type:String
  // },
  // Item_Collection_Value :{
  //   type:String
  // },
  // Item_Order_Code_ORD :{
  //   type:String
  // },
  // Item_Order_Value  :{
  //   type:String
  // },
  // Item_Producer_Value :{
  //   type:String
  // },
  // Item_Importer_Value :{
  //   type:String
  // },
  // Item_Origine_Value  :{
  //   type:String
  // }


// New Schema Modal

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
} 

},{timestamps:true})
 

 

module.exports = mongoose.model("vendordescription",vendorStockSchema);