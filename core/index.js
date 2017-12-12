// index.js
const Disk = require('./Disk')
    , Nfs = require('./Nfs')
    , default_config = require('../config')

module.exports = function(config = default_config){
    let disk = new Disk(config); 
    
    // Ready 
    return disk.ready.then(ok => {
        // Load Nfs 
        return disk.nfsLoad();
    }).then(nfs_data => {
        // Nfs Raw Data 
        // Merge To Nfs 
        return new Nfs(nfs_data, disk); 
    }); 
}
