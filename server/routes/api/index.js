const express = require('express')
    , router = express.Router()
    , nfs = require('./nfs')
    , user = require('./user')
    , all = require('./all')

router.get('/ping', function(req, res){
    res.json('pong')
});

router.use('/user', user); 

router.use('*', all); 

router.use('/nfs', nfs); 



module.exports = router;
