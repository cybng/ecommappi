const mongoose = require("mongoose");
const User = require("../modal/userModal");
const XlsData = require("../modal/XLS");
const vendorStockModel = require("../modal/vendorStockModel");
const vendorDescriptionModel = require("../modal/vendorDescriptionModal");
const Stock = require("../modal/stockModal");
var excelToJson = require('convert-excel-to-json');
const Description = require("../modal/descriptionModal");
const VendorImageModel = require("../modal/vendorImageModel");
const bcrypt = require("bcrypt");
const path = require("path");
const jwt = require("jsonwebtoken");
const filePath ="../vendorUploads";
const readXlsxFile = require("read-excel-file/node");
const xls=require("xlsx")
const csv = require("csvtojson");
const axios = require('axios').default;
const {responseError,responseSuccess} = require("../helper/Status");

exports.BusinessReg=(req,res)=>{
	console.log(req.body)
	const {fname,lname,username,email,businessName,businessNumber,businessType,phoneNumber,address,city,dateOfBirth,gender,password} = req.body;

//const {fname,lname,username,email,password,role,otp} = req.body;

    User.findOne({email:email}).exec(async(err,data)=>{
    	
    	if(data){
    		return responseError(res,201,14);
    	}
    	const hashPassword =  await bcrypt.hash(password,10);
        const role = "Vendor";
        const otp = Math.floor(100000+Math.random()*900000);
    	const userData =new User({
    		fname,lname,username,email,businessName,businessNumber,businessType,role,phoneNumber,address,city,dateOfBirth,gender,password,otp
    	});
        
    	userData.save((err,dt)=>{
            
    		if(err){
                console.log(err);
    			return responseError(res,201,4);
    		}
    		if(dt){     		
                const token = jwt.sign({_id:dt._id,role:dt.role},process.env.port,{expiresIn:"1d"})
    			res.cookie("token",token,{expiresIn:"1d"})
                const {_id,fname,lname,email,username,role,fullname} = dt;
    			const userDetail = {token,user:{_id,fname,lname,email,username,role}}; 
    			return responseSuccess(res,200,userDetail);
    		}
    	})

    })
}


exports.stock=()=>{
    Stock.save((err,data)=>{
        return res.status(200).json(data);
    })
}

exports.description=(req,res)=>{
 var q = Description.find().sort({created_at: -1}).limit(25);
    q.exec(function(err, property) {
        if (err) res.send(err);
        return res.status(200).json(property);
    });
 
}

exports.getVendor=(req,res)=>{
    User.find({role:"Vendor"},(err,data)=>{
        if(err){
            return res.status(201).json(err)
        }if(data){
            return res.status(200).json(data);
        }
    })
}
exports.statusUpdate=(req,res)=>{
    const {id,status} = req.body;
    console.log(id);
    const objectUserId = mongoose.Types.ObjectId(id); 
    User.findOneAndUpdate({_id:objectUserId},{status:status},(err,data)=>{
         
        if(err){return res.status(201).json(err)}
        if(data){return res.status(200).json(data)}    
    })
}

exports.vendorDelete=(req,res)=>{
    const {id} = req.body;
    console.log(id);
    const objectUserId = mongoose.Types.ObjectId(id); 
    User.deleteOne({_id:objectUserId},(err,data)=>{
         
        if(err){return res.status(201).json(err)}
        if(data){return res.status(200).json(data)}    
    })
}
exports.vendorEdit=(req,res)=>{
    const {id} = req.body;
    console.log(id);
    const objectUserId = mongoose.Types.ObjectId(id); 
    User.findOne({_id:objectUserId},(err,data)=>{
         
        if(err){return res.status(201).json(err)}
        if(data){return res.status(200).json(data)}    
    })
}
exports.updateStatus=(req,res)=>{
    const {id,fname,lname,businessName,businessNumber,businessType,email,phoneNumber,address,city} = req.body;
    const updateData={fname,lname,businessName,businessNumber,businessType,email,phoneNumber,address,city}
    console.log(id);
    const objectUserId = mongoose.Types.ObjectId(id); 
    User.findOneAndUpdate({_id:objectUserId},{fname,lname,businessName,businessNumber,businessType,email,phoneNumber,address,city},(err,data)=>{
         
        if(err){return res.status(201).json(err)}
        if(data){return res.status(200).json(data)}    
    })
}

exports.vendorDescription=(req,res)=>{ 
 csv()  
.fromFile(req.file.path)  
.then((jsonObj)=>{   
var uploadBy = {email:req.body.email,role:req.body.role};
 console.log(uploadBy)
 var csvValue = jsonObj.map(o => Object.assign({}, uploadBy, o));
 console.log(csvValue);
vendorDescriptionModel.insertMany(csvValue,(err,data)=>{  
if(err){  
console.log(err);  
}
return res.status(200).json(data)
}); 

});  

}




// exports.vendorStockCsv=(req,res)=>{ 
//  csv()  
// .fromFile(req.file.path)  
// .then((jsonObj)=>{   
// var uploadBy = {email:req.body.email,role:req.body.role};
//  // var csvValue = jsonObj.map(o => Object.assign({}, uploadBy, o));
//  var csvValue1 = jsonObj.map((o) => {

//      const split_string = o.pic.split(",")
//      // const split_string = [{"name":"abc"}];
//     return(
//  Object.assign({}, jsonObj,uploadBy, { pic: split_string,Item_Full_Code:o.Item_Full_Code })
//     );
//  });

// vendorStockModel.insertMany(csvValue1,(err,data)=>{  
// if(err){  
// console.log(err);  
// }
// return res.status(200).json(data)
// }); 

// });  

// }


// This is Based On New Stock Schema Modal
exports.vendorStockCsv=(req,res)=>{ 
 csv()  
.fromFile(req.file.path)  
.then((jsonObj)=>{   
var uploadBy = {email:req.body.email,role:req.body.role};
 var csvValue = jsonObj.map(o => Object.assign({}, uploadBy, o));
 

vendorStockModel.insertMany(csvValue,(err,data)=>{  
if(err){  
console.log(err);  
}
return res.status(200).json(data)
}); 

});  

}

 


exports.getVendorProduct=(req,res)=>{
    const {email} = req.body;
    console.log(email)
    var perPage = 10
    // page = Math.max(0, req.params.page)
    page = Math.max(0,1)

// XlsData.findOne({email:email})
//     .select('description')
//     .limit(perPage)
//     .skip(perPage * page)
//     .sort({
//         name: 'asc'
//     })
//     .exec(function(err, events) {
//         XlsData.count().exec(function(err, count) {
//             res.render('events', {
//                 events: events,
//                 page: page,
//                 pages: count / perPage
//             })
//         })
//     })

  // XlsData.find({email:email}).exec((err,dt)=>{
  //   dt[0].description.forEach(desId=>{
  //       console.log(desId.Item_Full_Code)
  //         XlsData.find({email:email}).exec((err,sdt)=>{
  //           dt[0].stock.forEach(stkId=>{
  //               if(stkId.Item_Full_Code===desId.Item_Full_Code){
  //                   console.log("matched");
  //               }
  //           })
  //         })
  //   })
  // })
 


 
    XlsData.find({email:email}).exec((err,data)=>{
        if(err){return res.status(201).json({msg:"Something Went Wrong"})}
            
            if(data){
console.log(data[0].description.length)
// function paginator(items, current_page, per_page_items) {
    let page =  1,
    per_page =  10,
    offset = (page - 1) * per_page,

    paginatedItems = data[0].description.slice(offset).slice(0, 2),
    // console.log(paginatedItems)
    total_pages = Math.ceil(data[0].description.length / per_page);
    console.log(total_pages)
    return res.status(200).json({
        page: page,
        per_page: per_page,
        pre_page: page - 1 ? page - 1 : null,
        next_page: (total_pages > page) ? page + 1 : null,
        total: data[0].description.length,
        total_pages: total_pages,
        data: paginatedItems
    });
// }


            }
    })

}


exports.vendorProductList=(req,res)=>{
    const {email} = req.body;
    console.log(email)
    vendorDescriptionModel.find({email:email},(err,data)=>{
        if(err){return res.status(201).json({msg:"Something went wrong"})}
        if(data){return res.status(201).json(data)}
    })
}

exports.vendorProductListJoin=(req,res)=>{
    const {email} = req.body;
    
    const agentJoin=vendorDescriptionModel.aggregate([
       {
        $lookup: {
          from: "vendorStocks",
          localField: "email",
          foreignField: "email",
          as: "other",
         },
       },
     { $project: { _id: false} },
     {$unwind: "$other"},
  ]);
    console.log(agentJoin)
  agentJoin.exec((err,data)=>{
        if(err){
            return res.status(201).json(err);
        }
        if(data){
            return res.status(200).json(data);
        }
    });
}


 exports.getVendorProductById=(req,res)=>{
    const {email,role} = req.body;
    if(role==="vendor" || role==="Vendor"){
    const agentJoin=vendorDescriptionModel.aggregate([
       
        { $limit : 20 },
        {$match : {email : email,role:role}},
       { $lookup: {
          from: "vendorstocks",
          localField: "item_code",
          foreignField: "item_code",
          as: "stocks",
         },
       },
     { $project: {"stocks.email":false} },
     {$unwind: "$stocks"},
  ]);
  agentJoin.exec((err,data)=>{
        if(err){
            return res.status(201).json(err);
        }
        if(data.length){
            return res.status(200).json(data);
        } 
    });
}else if(role==="admin" || role==="Admin"){
    const agentJoin=vendorDescriptionModel.aggregate([
       
        { $limit : 20 }, 
       { $lookup: {
          from: "vendorstocks",
          localField: "item_code",
          foreignField: "item_code",
          as: "stocks",
         },
       },
     { $project: {"stocks.email":false} },
     {$unwind: "$stocks"},
  ]);
  agentJoin.exec((err,data)=>{
        if(err){
            return res.status(201).json(err);
        }
        if(data.length){
            return res.status(200).json(data);
        } 
    });
}

  // vendorDescriptionModel.find({$and:[{email:email},{role:role}]}).limit(10).sort({$natural:1}).exec((err,data)=>{
  //    if(err){
  //           return res.status(201).json(err);
  //       }
  //       if(data){
  //           return res.status(200).json(data);
  //       } 
  // })

 }


 exports.productdetail=(req,res)=>{
    console.log(req.body)
     const {email,role,productId} = req.body;
     console.log(req.body)
    const agentJoin=vendorDescriptionModel.aggregate([
       
        {$match : {email : email,role:role,item_code:productId}},
       { $lookup: {
          from: "vendorstocks",
          localField: "item_code",
          foreignField: "item_code",
          as: "stocks",
         },
       },
     { $project: {"stocks.email":false} },
     {$unwind: "$stocks"},
  ]);
  agentJoin.exec((err,data)=>{
        if(err){
            return res.status(201).json(err);
        }
        if(data){
            return res.status(200).json(data);
        }
    });
 }


 exports.updatedescription=(req,res)=>{
    const {_id} = req.body;

    vendorDescriptionModel.updateMany({_id:_id},{$set:req.body},{multi:true}).exec((err,data)=>{
        if(err){
            return res.status(201).json(err);
        }
        if(data){
            console.log("success");
            return res.status(200).json({msg:"Update Successfull"});
        }
    })
 }


 exports.deleteproductlist=(req,res)=>{
    const {descriptionId,stockId} = req.body
    vendorDescriptionModel.findOneAndDelete({Item_Full_Code:descriptionId},(err,data)=>{
        if(err){return res.status(201).json(err)}
        if(data){
            vendorStockModel.findOneAndDelete({Item_Full_Code:stockId},(er,dt)=>{
                if(er){return res.status(201).json(err)}
                if(dt){return res.status(200).json({msg:"Product Deleted"})}
            })
        }
    })
 }
 

 exports.multiimage=(req,res)=>{
  const {vendorEmail} = req.body
  const reqFiles = [];

    const url = req.protocol + '://' + req.get('host')
    console.log(url)

    for (var i = 0; i < req.files.length; i++) {
      console.log(req.files[i].filename)
        reqFiles.push(url + '/vendorImages/' + req.files[i].filename)
    }
  
    const imageModalData = VendorImageModel({
        vendorEmail:vendorEmail,
        vendorImage:reqFiles
    })

    imageModalData.save((err,data)=>{
        if(err){
            return res.status(201).json({err});
        }
        if(data){
            return res.status(200).json({msg:"Image Upload successfull"});
        }
    });
 }


exports.getVendorImagesById=(req,res)=>{
    const {email} = req.body;

    VendorImageModel.find({vendorEmail:email}).exec((err,data)=>{
        if(err){return res.status(201).json(err)}
        if(data){return res.status(200).json(data)}
    })
}
exports.imagedetails=(req,res)=>{
     const {email,productId} = req.body;

    VendorImageModel.findOne({_id:productId,vendorEmail:email}).exec((err,data)=>{
        if(err){return res.status(201).json(err)}
        if(data){return res.status(200).json(data)}
    })
}


 exports.deleteimagelist=(req,res)=>{
    const {email,id} = req.body
    VendorImageModel.findOneAndDelete({_id:id,vendorEmail:email},(err,data)=>{
        if(err){return res.status(201).json(err)}
        if(data){ 
                if(data){return res.status(200).json({msg:"Image Deleted"})}
        }
    })
 }
 exports.deletesingleimagelist=(req,res)=>{
    const {email,productId,imageKey,imgName} = req.body
    var arrIndex = `vendorImage.${imageKey}`;
    // const aa= {$upset: {[arrIndex]:imgName}};
 
    // console.log(aa)
    VendorImageModel.findOneAndUpdate({_id:productId}, {$unset: {[arrIndex]:imgName}},{multi:true}).exec((err,data)=>{
    return res.status(200).json("success");
})


 }

 exports.addproductmanual=(req,res)=>{
    const data = req.body;
    console.log(data)
    const reqFiles = [];

    const url = req.protocol + '://' + req.get('host')
    console.log(url)

    for (var i = 0; i < req.files.length; i++) {
      console.log(req.files[i].filename)
        reqFiles.push(url + '/vendorManualImages/' + req.files[i].filename)
    }
    const newProductManualStore = vendorDescriptionModel({
        email:req.body.email,
        role:req.body.role,
        name:req.body.name,
        item_code:req.body.item_code,
        description:req.body.description,
        retail_unite_of_meassure:req.body.retail_unite_of_meassure,
        regular_price:req.body.regular_price,
        sale_price:req.body.sale_price,
        tax_class:req.body.tax_class,
        dimensions:req.body.dimensions,
        color:req.body.color,
        age:req.body.age,
        brand:req.body.brand,
        stock_status:req.body.stock_status,
        vendor:req.body.vendor,
        product_manufacturer_code:req.body.product_manufacturer_code,
        product_cat:req.body.product_cat,
        properties:req.body.properties,
        properties_en:req.body.properties_en,
        composition:req.body.composition,
        composition_en:req.body.composition_en,
        components:req.body.components,
        components_en:req.body.components_en,
        collectionn:req.body.collectionn,
        ordering:req.body.ordering,
        origine:req.body.origine,
        images:reqFiles
 
    })

    // const vendorStockData = vendorStockModel({
    //     email:req.body.email,
    //     role:req.body.role,
    //     Item_Full_Code:req.body.Item_Full_Code, 
    //     pic:reqFiles
    // })

    newProductManualStore.save((err,data)=>{
        if(err){return res.status(201).json(err)}
        if(data){
            // vendorStockData.save((vndrErr,vndrData)=>{
            //     if(vndrErr){return res.status(201).json(vndrErr)}
            //     if(vndrData){
            //         return res.status(200).json(vndrData)
            //     }
            // })
            return res.status(200).json(data)

            }
    })
 }


 exports.getById=(req,res)=>{ 
    const objectUserId = mongoose.Types.ObjectId(req.body.id); 
    User.findOne({_id:objectUserId},(err,data)=>{
        if(err){
            return res.status(201).json(err)
        }if(data){
            return res.status(200).json(data);
        }
    })
}


exports.vendorAdd=(req,res)=>{
    const {id} = req.body;
    console.log("req.body ===== ", req.body);
    return false;
    
    console.log(id);
    const objectUserId = mongoose.Types.ObjectId(id); 
    User.findOne({_id:objectUserId},(err,data)=>{
         
        if(err){return res.status(201).json(err)}
        if(data){return res.status(200).json(data)}    
    })
}
 

exports.livesyncstock=async(req,res)=>{
    try {
 const {username,password,dateTime} = req.body
   var nwDt=dateTime.split("T")
        var nwTime = nwDt[1]; 
        const [year, month, day] = nwDt[0].split('-');
        const DDMMYYYY = [day, month, year].join('-');
        const parameterDate = DDMMYYYY+" "+nwTime+":00"
        console.log(parameterDate)
    const token = `${username}:${password}`;
    const encodedToken = Buffer.from(token).toString('base64');
    const session_url = 'http://46.99.130.129:65015/products/stock?date='+parameterDate;

    var config = {
      method: 'get',
      url: session_url,
      headers: { 'Authorization': 'Basic '+ encodedToken }
    };

    axios(config)
    .then(function (response) { 
      const allData=[];
      response.data.stockList.forEach((dt)=>{
        allData.push(dt)
      })

      // return res.status(200).json(allData);
      const totalUpdateData=[];
      allData.forEach((updateData)=>{ 
        const idd = "06830653433M";
        vendorStockModel.update({item_code:updateData.item_code},{variant_desctiption:updateData.variant_desctiption,stock_quantity:updateData.stock_quantity},(err,upd)=>{
            totalUpdateData.push(upd);
        })
      })

      return res.status(200).json({msg:"Descriptions ERP sync successful"})
     })
    .catch(function (error) {
      console.log(error);
    });
 
}catch(e){
    console.log(e)
}

}

exports.livesyncdescription=async(req,res)=>{
    try { 
  const {username,password,dateTime} = req.body
  console.log(username)
  console.log(password) 
  // var username = 'asw';
  //   var password = '53d4ee58-72d0-46a4-9c42-e337aa417508'
    var dt='2022-07-26T16:41'
        var nwDt=dateTime.split("T")
        var nwTime = nwDt[1]; 
        const [year, month, day] = nwDt[0].split('-');
        const DDMMYYYY = [day, month, year].join('-');
        const parameterDate = DDMMYYYY+" "+nwTime+":00"
        console.log(parameterDate)
    const token = `${username}:${password}`;
    const encodedToken = Buffer.from(token).toString('base64');
    const session_url = 'http://46.99.130.129:65015/products/description?date='+parameterDate;

    console.log(session_url)

    var config = {
      method: 'get',
      url: session_url,
      headers: { 'Authorization': 'Basic '+ encodedToken }
    };

    axios(config)
    .then(function (response) { 
      const allData=[];
      response.data.itemList.forEach((dt)=>{
        allData.push(dt)
      })

      // return res.status(200).json(allData);
      const totalUpdateData=[];
      allData.forEach((updateData)=>{ 
        const idd = "06830653433M";
        vendorDescriptionModel.update({item_code:updateData.item_code},{sale_price:updateData.sale_price,regular_price:updateData.regular_price},(err,upd)=>{
            totalUpdateData.push(upd);
        })
      })
      return res.status(200).json({msg:"Descriptions ERP sync successful"})
     })
    .catch(function (error) {
      console.log(error);
    });
 
}catch(e){
    console.log(e)
}

}
 
