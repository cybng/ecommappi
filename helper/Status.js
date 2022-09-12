const {msg} = require("./Messages");
exports.responseError=(res,status,msgId)=>{
	return res.status(status).json({message:`${msg[msgId]}`});
}

exports.responseSuccess=(res,status,data)=>{
	return res.status(status).json(data);
}