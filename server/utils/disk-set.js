// disk-set.js
const { diskModel } = require('./db')
    , set = {}
    , N = require('../../core')
    , diskTable = {}

set.create = function(user_id){
    let obj = {}; 
    obj.owner = user_id; 

    obj = new diskModel(obj); 

    return obj.save().then(disk_config => {
        disk_config = disk_config.toObject(); 
    
        return N(disk_config).then(nfs => {
            diskTable[disk_config._id] = nfs; 

            return disk_config; 
        }); 
    }); 
}

set.list = function(user_id){
    return diskModel.find({
        user_id
    }).populate('owner'); 
}

set.open = function(_id){
    if (diskTable[_id]){
        return Promise.resolve(diskTable[_id]); 
    } else {
        return diskModel.findOne({ _id }).then(disk_config => {
            if (!disk_config) return Promise.reject('NOT FOUND'); 

            disk_config = disk_config.toObject(); 
        
            return N(disk_config).then(nfs => {
                diskTable[disk_config._id] = nfs; 

                return nfs; 
            }); 
        })
    }
}

module.exports = set; 
