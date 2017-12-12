// index.js
const jwt = require('jsonwebtoken')
    , SECRET = `nfs-secret-key`

let auth = {}; 

auth.en = function(data = {}){
	let token = jwt.sign({
		// 一个钟 
		exp: Math.floor(Date.now() / 1000) + 99000000, 
		data: data
	}, SECRET);

	return token; 
}

auth.de = function(token){
	let data;

	// 否则尝试解开 
	try {
		opt = jwt.verify(token, SECRET);

		return Promise.resolve(opt.data); 
	} catch (err) {
		return Promise.reject(false); 
	}
}

module.exports = auth; 
