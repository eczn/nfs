const express = require('express')
    , { userModel } = require('../../utils/db')
    , router = express.Router()
    , auth = require('../../utils/auth')
    , rps = require('../../utils/rps')


router.get('/', function(req, res, next) {
    userModel.find(req.query || {}, { pwd: 0 }).then(docs => {
        rps.send2000(res, docs); 
    }).catch(err => {
        console.log(err); 

        rps.send5000(res, err); 
    })
});

router.post('/login', function(req, res){
    let { username } = req.body; 

    userModel.findOne({ username }).then(doc => {
        if (doc){
            if (doc.pwd === req.body.pwd){
                let token = auth.en(doc); 
                
                res.cookie('user-token', token, {
                    expires: new Date('2018-02-01')
                });
                rps.send2000(res, token); 
            } else {
                rps.send4001(res, req.body); 
            }
        } else {
            rps.send4001(res, req.body); 
        }
    }).catch(err => {
        console.log(err); 

        rps.send5000(res, err); 
    })
}); 

router.get('/me', function(req, res){
    let token = req.cookies['user-token']; 
    
    if (token){
        auth.de(token).then(user => {
            rps.send2000(res, user); 
        });
    } else {
        rps.send2000(res, null); 
    }
})

router.get('/logout', function(req, res){
    console.log('!'); 

    res.cookie('user-token', '', {
        expires: new Date('1970-01-01')
    });

    rps.send2000(res, 'ok'); 
})

router.post('/', function(req, res){
    let body = req.body; 

    let new_user = new userModel(body); 

    new_user.save().then(ok => {
        rps.send2000(res, ok); 
    }).catch(err => {
        console.log(err); 
        rps.send5000(res, err); 
    })
})

module.exports = router;
