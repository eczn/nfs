const express = require('express')
    , router = express.Router()
    , rps = require('../../utils/rps')
    , diskSet = require('../../utils/disk-set')
    , temp = require('../../utils/temp_file')

/**
 * @description get user's disk 
 */
router.get('/', function(req, res, next) {
    let user_id = req.user._id; 
    
    diskSet.list().then(myDisks => {
        rps.send2000(res, myDisks); 
    }).catch(err => {
        console.log(err); 
        rps.send5000(res, err); 
    });
});

/**
 * @description create a disk for user 
 */
router.post('/', function(req, res){
    let user_id = req.user._id; 

    diskSet.create(user_id).then(disk_config => {
        rps.send2000(res, disk_config); 
    }).catch(err => {
        console.log(err); 

        rps.send5000(res, err); 
    }); 
}); 

/**
 * @description find nfs and pass cmd to process 
 */
router.post('/cmd', function(req, res){
    let _id = req.body._id;
    let cmd = req.body.cmd.trim(); 
    let buf_base64 = req.body.buf_base64; 
    let preprocess  = req.body.preprocess; 
    let list = cmd.split(' '); 

    console.log(cmd, preprocess)

    // 如果有 buf 数据 
    if (buf_base64){
        let buf = Buffer.from(buf_base64, 'base64'); 
        let position = list.indexOf('%buf%'); 
        list[position] = buf; 
    }

    let todo = list[0]; 
    let args = list.slice(1); 
    let nfs = null; 
    diskSet.open(_id).then(_nfs => {
        nfs = _nfs;

        return nfs[todo].apply(nfs, args)
    }).then(nfs_result => {
        // console.log(nfs_result); 
        if (Buffer.isBuffer(nfs_result)){
            if (preprocess === 'url'){
                let lsArgs = args.map(e => e); 
                let file = nfs['ls'].apply(nfs, args); 
                temp.add(nfs_result, file.ext).then(url => {
                    let data = nfs_result.toJSON();
                    data.url = url; 
                    res.json({
                        code: 2000, 
                        data: data, 
                        msg: 'nfs 调用成功'
                    }); 
                }); 
            } else if (preprocess === 'string'){
                res.json({
                    code: 2000, 
                    data: nfs_result.toString(), 
                    msg: 'nfs 调用成功'
                }); 
            } else {
                res.json({
                    code: 2000, 
                    data: nfs_result.toJSON(), 
                    msg: 'nfs 调用成功'
                }); 
            }
        } else {
            res.json({
                code: 2000, 
                data: nfs_result || null, 
                msg: 'nfs 调用成功'
            }); 
        }
    }).catch(err => {
        console.log(err); 

        rps.send5000(res, err)
    })
});

module.exports = router;
