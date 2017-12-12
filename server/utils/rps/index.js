// responser/index.js
let responser = {}; 
let code2msg = {
	2000: '接口调用成功'
}

responser.send = code => (res, data = {}, error) => {
	let toSend = {}; 

	toSend.code = code; 
	toSend.data = data; 
	toSend.msg = code2msg[code]; 
	if (error) toSend.error = error; 

	res.json(toSend)
}

Object.keys(code2msg).forEach(code => {
	responser['send' + code] = responser.send(parseInt(code)); 
}); 

module.exports = responser; 
