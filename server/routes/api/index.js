const express = require('express')
    , router = express.Router()
    , nfs = require('./nfs')
    , user = require('./user')
    , all = require('./all')

router.use('*', function(req, res, next){
    res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
	res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
	res.header("X-Powered-By",'ECZN@NIGHTWATCH'); 
	res.header("Content-Type", "application/json;charset=utf-8");
	res.header("Cache-Control", "no-cache, no-store, must-revalidate");

    if (req.method === "OPTIONS") {
		res.sendStatus(200);
	} else {
        next(); 
    }
})

router.get('/ping', function(req, res){
    res.json('pong')
});

router.use('/user', user); 

router.use('*', all); 

router.use('/nfs', nfs); 



module.exports = router;
