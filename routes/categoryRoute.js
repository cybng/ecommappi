var express = require('express');
var router = express.Router();
var Category = require("../modal/categoryModal");
var Coupon = require("../modal/couponModal");
var slugify = require("slugify");
var CMS = require("../modal/cmsModal")
var Coupon = require("../modal/couponModal")
const vendorDescriptionModel = require("../modal/vendorDescriptionModal");

function createCategories(categories,parentId=null){
  const categoryList = [];
  var category; 

  if(parentId == null){
    category = categories.filter(cat=>cat.parentId==undefined);
    console.log(category)
  }else{
    category = categories.filter(cat=>cat.parentId==parentId)
  }

  for(let cate of category){ 
       categoryList.push({
        _id: cate._id,
        name: cate.name,
        slug: cate.slug,
        children:createCategories(categories,cate._id)
       })
  }

  return categoryList;


}


router.post('/addcategory', function(req, res, next) {
  console.log(req.body)
    const {name,parentId} = req.body;
    const categoryObj={
      name:name,
      slug:slugify(name),
     }
     if(parentId){
      categoryObj.parentId = parentId
     }  
     const cat = new Category(categoryObj);
     cat.save((err,data)=>{
      console.log(err)
      if(err){return res.status(201).json(err)}
      if(data){return res.status(200).json(data)}
     })
});

router.get("/getcategory",(req,res)=>{
  Category.find({}).exec((err,categories)=>{
    if(err){return res.status(201).json(err)}
    if(categories){
      const categoryList = createCategories(categories);
     return res.status(200).json({categoryList})
    }
  })
})


router.post("/deletecategory",async(req,res)=>{
     const { ids } = req.body;
     if(ids!=undefined){
  const deletedCategories = [];
  for (let i = 0; i < ids.length; i++) {
    console.log(ids[i])
    const deleteCategory = await Category.findOneAndDelete({
      _id: ids[i]
    });
    deletedCategories.push(deleteCategory);
  }

  if (deletedCategories.length == ids.length) {
    res.status(201).json({ message: "Categories removed" });
  } else {
    res.status(400).json({ message: "Something went wrong" });
  }}
})

router.post("/addcms",(req,res)=>{
  console.log(req.body)
  const {pageTitle,editorData} = req.body;

  const cmsObj=CMS({
    pageTitle,pageContent:editorData
  });
  cmsObj.save((err,data)=>{
    if(err){return res.status(201).json(err)}
    if(data){return res.status(200).json(data)}  
  })

})

router.post("/getcms",(req,res)=>{
    CMS.find({},(err,data)=>{
    if(err){return res.status(201).json(err)}
    if(data){return res.status(200).json(data)}  
 

})
  })

router.post("/deletecms",(req,res)=>{
  const {id} = req.body;
  CMS.findOneAndDelete({_id:id},(err,data)=>{
    if(err){
      return res.status(201).json(err)
    }
    if(data){
      return res.status(200).json(data);
    }
  })
})

router.post("/updatecms",(req,res)=>{
  const {id,pageTitle,editorData} = req.body;
  CMS.findOneAndUpdate({_id:id},{pageTitle:pageTitle,pageContent:editorData},(err,data)=>{
    if(err){
      return res.status(201).json(err)
    }
    if(data){
      return res.status(200).json(data);
    }
  })
})

router.post("/addcoupon",(req,res)=>{
  console.log(req.body)
  const {couponCode,
couponDescription,
couponType,
couponUsage,
couponExpire,
indivisualUse,
excludeUse,
productList,
couponPrice} = req.body;

  Coupon.findOne({couponCode:couponCode},(errCou,dataCou)=>{
    if(dataCou){
      return res.status(201).json({msg:"Coupon Code already exists"});
    }else{

  const couponObj=Coupon({
    couponCode,
couponDescription,
couponType,
couponUsage,
couponExpire,
indivisualUse,
excludeUse,
productList,
  })

  couponObj.save((err,data)=>{
    if(err){
      return res.status(201).json(err)
    }
    if(data){
      return res.status(200).json(data);
    }
  })
}
  })
  
})

router.post("/getcoupon",(req,res)=>{
    Coupon.find({},(err,data)=>{
    if(err){return res.status(201).json(err)}
    if(data){return res.status(200).json(data)}  
 

})
  })

router.post("/deletecoupon",(req,res)=>{
  const {id} = req.body;
  Coupon.findOneAndDelete({_id:id},(err,data)=>{
    if(err){
      return res.status(201).json(err)
    }
    if(data){
      return res.status(200).json(data);
    }
  })
})

router.post("/editcoupon",(req,res)=>{
  const {couponId,couponCode,couponDescription,couponType,couponUsage,couponExpire} = req.body;
  Coupon.findOneAndUpdate({_id:couponId},{couponCode:couponCode,couponDescription:couponDescription,couponType:couponType,couponUsage:couponUsage,couponExpire:couponExpire},(err,data)=>{
    if(err){
      return res.status(201).json(err)
    }
    if(data){
      return res.status(200).json(data);
    }
  })
})


router.post("/getallproductadmin",(req,res)=>{
  vendorDescriptionModel.find({},(err,data)=>{
    if(err){res.status(201).json(err)}
    if(data){res.status(200).json(data)}
  })
})

module.exports = router;
