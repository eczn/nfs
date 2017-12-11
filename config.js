const path = require('path')
    , DISK_BASE = path.join(__dirname, 'DISK')

module.exports = {
    // db 
    DISK_BASE: DISK_BASE,
    // dl 
    DISK_LOCATION: path.join(DISK_BASE, 'fake-disk.dat'), 
    // All 20 MB
    DISK_SIZE: 20971520, 
    // bs
    BLOCK_SIZE: 4096,
    // 4 MB nfs 
    NFS_SIZE: 4194304, 
    // 16 MB reamin 
    RAW_SIZE: 20971520 - 4194304
}
