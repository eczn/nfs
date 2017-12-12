// init.js
const fs = require('then-fs')
    , mkdir = require('../utils/mkdir')
    , nfsMinimum = require('./nfs_minimum')
    , nfs_buf = Buffer.from(JSON.stringify(nfsMinimum), "binary");

/**
 * @description 初始化一个磁盘
 * @param {opt} opt 
 */
function init(opt){
    let { DISK_LOCATION, DISK_BASE } = opt; 
    mkdir(DISK_BASE); 

    return fs.open(DISK_LOCATION, 'r+').then(fd => {
        opt.disk_fd = fd; 
        return fd; 
    }).catch(err => {
        console.log('[ TIP ] file not found and now to create disk'); 
        return createDisk(opt); 
    })
}


function createDisk(opt){
    let { DISK_LOCATION, DISK_SIZE } = opt; 

    // 空数据填 0 
    const void_buf = Buffer.alloc(DISK_SIZE, 0, "binary"); 

    let disk_data = Buffer.concat(
        [nfs_buf, void_buf],
        DISK_SIZE
    );

    // Create Buffer 
    opt.buffer = disk_data; 

    return fs.writeFile(DISK_LOCATION, disk_data).then(ok => {
        console.log('[ Finish ] createDisk'); 
        return init(opt); 
    }).catch(err => {
        console.log('[ ERROR ] createDisk'); 
        console.log(err);
        return Promise.reject(err); 
    }); 
}

module.exports = init; 
