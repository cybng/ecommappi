var express = require('express');
var router = express.Router();
const multer  = require('multer')
const picPath = require("path");
const shortid = require("shortid");

const axios = require('axios');

var {BusinessReg,stock,description,getVendor,statusUpdate,vendorDelete,vendorEdit,updateStatus,vendorDescription,vendorStock,getVendorProduct,vendorProductList,vendorProductListJoin,vendorStockCsv,getVendorProductById,productdetail,updatedescription,deleteproductlist,multiimage,getVendorImagesById,imagedetails,deleteimagelist,deletesingleimagelist,addproductmanual, getById, vendorAdd,livesyncstock,livesyncdescription} = require("../controller/businessController");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, picPath.join(picPath.dirname(__dirname), "vendorUploads"));
  },
  filename: function (req, file, cb) {
    cb(null, shortid.generate() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

const storageMulti = multer.diskStorage({
    destination: (req, file, cb) => {
        // cb(null, DIR);
        cb(null, picPath.join(picPath.dirname(__dirname), "vendorImages"));
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, shortid.generate() + '-' + fileName)
    }
});

const storageManualMulti = multer.diskStorage({
    destination: (req, file, cb) => {
        // cb(null, DIR);
        cb(null, picPath.join(picPath.dirname(__dirname), "vendorManualImages"));
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, shortid.generate() + '-' + fileName)
    }
});


var uploadMulti = multer({
    storage: storageMulti,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('File type not accepted (.png, .jpg, .jpeg)'));
        }
    }
});
var uploadManualMulti = multer({
    storage: storageManualMulti,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('File type not accepted (.png, .jpg, .jpeg)'));
        }
    }
});

router.post('/businessReg',BusinessReg);
router.get('/stock',stock);
router.get('/description',description);
router.get("/getVendor",getVendor)
router.post("/statusUpdate",statusUpdate)
router.post("/vendorDelete",vendorDelete)
router.post("/vendorEdit",vendorEdit)
router.post("/updateStatus",updateStatus);
router.post("/getVendorProduct",getVendorProduct)
router.post("/vendorProductList",vendorProductList)
router.get("/vendorProductListJoin",vendorProductListJoin)
router.post("/getVendorProductById",getVendorProductById)
router.post("/productdetail",productdetail)
router.post("/updatedescription",updatedescription)
router.post("/deleteproductlist",deleteproductlist)
router.post("/vendorDescription",upload.single('excelFile'),vendorDescription);
router.post("/vendorStockCsv",upload.single('stockFile'),vendorStockCsv);
// router.post("/multiimage",uploadMulti.array('multiFile', 10),multiimage);
router.post("/multiimage",uploadMulti.array('multiFile', 10),multiimage);
router.post("/getVendorImagesById",getVendorImagesById)
router.post("/imagedetails",imagedetails)
router.post("/deleteimagelist",deleteimagelist)
router.post("/deletesingleimagelist",deletesingleimagelist)
router.post("/addproductmanual",uploadManualMulti.array('multiFile', 10),addproductmanual)
router.post("/getById",getById)
router.post("/vendorAdd",vendorAdd)

router.post("/livesyncstock",livesyncstock)
router.post("/livesyncdescription",livesyncdescription)
// router.post("/sellerFile",upload.single('csvFile'),sellerFile);
// router.post("/vendorStock",upload.single('excelFile'),vendorStock);

module.exports = router;
