// responser/index.js
let responser = {}; 
let code2msg = {
	2000: '接口调用成功', 
	5000: 'err',
	4000: '未登陆或者登陆过期',
	4001: '账号密码错误'
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
