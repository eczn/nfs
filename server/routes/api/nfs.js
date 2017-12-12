const express = require('express')
    , router = express.Router()
    , rps = require('../../utils/rps')
    , diskSet = require('../../utils/disk-set')

router.get('/', function(req, res, next) {
    rps.send2000(res, diskSet.list()); 
});

module.exports = router;
