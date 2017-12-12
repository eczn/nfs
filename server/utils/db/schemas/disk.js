// user.js
const mongoose = require('../connect')
    , path = require('path')
    , uuid = require('uuid/v4')
    , config = require('../../../../config')

let userSchema = mongoose.Schema({
    // db 
    DISK_BASE: {
		type: String,
        default: config.DISK_BASE
	},
    // dl 
    DISK_LOCATION: {
        type: String, 
        default: () => path.join(config.DISK_BASE, `${uuid()}.dat`), 
        unique: true
    }, 
    // All 20 MB
    DISK_SIZE: {
        type: Number, 
        default: 20971520
    }, 
    // bs
    BLOCK_SIZE: {
        type: Number, 
        default: 4096
    },
    // bc 
    BLOCK_COUNT: {
        type: Number, 
        default: (20971520 - 4194304) / 4096
    }, 
    // 4 MB nfs 
    NFS_SIZE: {
        type: Number, 
        default: 4194304
    }, 
    // 16 MB reamin 
    RAW_SIZE: {
        type: Number, 
        default: 20971520 - 4194304
    },
    created_at: {
		type: Date, 
		default: Date.now
    },
    owner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'user', 
		required: true
	}
});

module.exports = userSchema; 
