// all.js
const express = require('express')
    , router = express.Router()
    , { userModel, banModel } = require('../../utils/db')
	, auth = require('../../utils/auth')
	, rps = require('../../utils/rps')

// 设置跨域访问
module.exports = function(req, res, next){
	let token = req.cookies['user-token']; 

	if (token){
		auth.de(token).then(user => {
			req.user = user;
			next(); 
		}, invalid => {
			rps.send4000(res, token); 
		}); 
	} else {
		rps.send4000(res, token); 
	}

}
