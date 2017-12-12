const express = require('express')
    , router = express.Router()
    , nfs = require('./nfs')


router.get('/ping', function(req, res){
    res.json('pong')
});

router.use('/nfs', nfs); 


module.exports = router;
