# ecommappi

const vendorDescriptionModel = require("../modal/vendorDescriptionModal");
const vendorStockModel = require("../modal/vendorStockModel");
const slugify = require("slugify");
const readXlsxFile = require("read-excel-file/node");
const excel = require("exceljs");

const uploadExl = async (req, res) => {
  var uploadBy = {email:req.body.email,role:req.body.role};
  try {
    if (req.file == undefined) {
      return res.status(400).send("Please upload an excel file!");
    }

    let path =
      __basedir + "/resources/static/assets/uploads/" + req.file.filename;

      // console.log(path)

    readXlsxFile(path).then((rows) => {
      // skip header
      rows.shift();

      let tutorials = [];

      // console.log("rows ====== ", rows)

      rows.forEach((row) => {
        let tutorial = { 
vendor:row[0],
collection:row[1],
item_code:row[2],
description:row[3],
category_ID:row[4],
composition:row[5],
dimensions:row[6],
images:row[7],
Vendor_ID:row[8]

        };

        tutorials.push(tutorial);
      });
 
var csvValue1 = tutorials.map((o) => {
    console.log("0000000000000000000",o)
     

     const split_string = o.images.split(",") 
     
    return(
 Object.assign({}, tutorials,uploadBy, { 
 images: split_string,
 name:o.description,
 vendor: o.vendor,
 item_code:o.item_code,
 description:o.description,
 collectionn:o.collection,
 catId:o.category_ID,
 composition:o.composition,
 dimensions:o.dimensions,
 email:req.body.email,
 role:req.body.role,
 vendorId:o.Vendor_ID,
 gender:o.category_ID?.charAt(0)==="1"?"female":o.category_ID?.charAt(0)==="2"?"male":o.category_ID?.charAt(0)==="3"?"kids":o.category_ID?.charAt(0)==="4"?"unisex":"",
 slug:slugify(o.description+"-"+o.item_code)

 })
    );
 });
 //New Added....  BY R4H
  var csvValue2 = tutorials.map((o) => {

     const split_string = o.images.split(",") 
    return(
 Object.assign({}, tutorials,uploadBy, { 
 pic: split_string, 
 vendor: o.vendor,
 item_code:o.item_code, 
 email:req.body.email,
 role:req.body.role

 })
    );
 });



vendorStockModel.insertMany(csvValue2,(err,data)=>{  
if(err){  
console.log(err);  
}
});

//FINISHED
csvValue1.forEach((dt)=>{
  // console.log(dt.name+"==="+dt.item_code+"==="+dt.email)
  console.log("xxxxxxxxxxxxx------------------>>>>>>>",dt.vendorId)
  vendorDescriptionModel.find({item_code:dt.item_code},(err,data)=>{
    if(data.length>0){
      // console.log(data)
      // vendorDescriptionModel.updateMany({item_code:dt.item_code},{$set:{name:dt.name}}).exec();
      // console.log("Update");
    }else{
      vendorDescriptionModel.insertMany({
       images: dt.images,
       name:dt.description,
       vendor:dt.vendor,
       item_code:dt.item_code,
       description:dt.description,
       collectionn:dt.collection,
       catId:dt.catId,
       composition:dt.composition,
       dimensions:dt.dimensions,
       email:req.body.email,
       role:req.body.role,
       vendorId:dt.vendorId,
       gender:dt.catId?.charAt(0)==="1"?"female":dt.catId?.charAt(0)==="2"?"male":dt.catId?.charAt(0)==="3"?"kids":dt.catId?.charAt(0)==="4"?"unisex":"",
       slug:slugify(dt.description+"-"+dt.item_code)

      },(err,data)=>{
        console.log("err",err)
        console.log("Inserted");
      })
    }
  })
 
})
 
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Could not upload the file: " + req.file.originalname,
    });
  }
};

const getTutorials = (req, res) => {
  Tutorial.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials.",
      });
    });
};

const download = (req, res) => {
  Tutorial.findAll().then((objs) => {
    let tutorials = [];

    objs.forEach((obj) => {
      tutorials.push({
        id: obj.id,
        title: obj.title,
        description: obj.description,
        published: obj.published,
      });
    });

    let workbook = new excel.Workbook();
    let worksheet = workbook.addWorksheet("Tutorials");

    worksheet.columns = [
      { header: "Id", key: "id", width: 5 },
      { header: "Title", key: "title", width: 25 },
      { header: "Description", key: "description", width: 25 },
      { header: "Published", key: "published", width: 10 },
    ];

    // Add Array Rows
    worksheet.addRows(tutorials);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=" + "tutorials.xlsx"
    );

    return workbook.xlsx.write(res).then(function () {
      res.status(200).end();
    });
  });
};

module.exports = {
  uploadExl,
  getTutorials,
  download,
};
