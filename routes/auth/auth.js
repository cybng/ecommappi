var express = require('express');
var router = express.Router();
var {login,reg} = require("../../controller/authController");

router.post('/login',login);
router.post('/reg',reg);

module.exports = router;
