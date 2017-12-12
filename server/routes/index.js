const express = require('express')
	, router = express.Router()
	, api = require('./api')

router.use('/api', api); 

module.exports = router;
