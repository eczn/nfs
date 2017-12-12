// nfs_minimum.js 
const { BLOCK_COUNT } = require('../../config'); 

module.exports = {
    // F-Tree 
    root: {
        isDirectory: true,
        cTime: Date.now(), 
        files: []
    }, 
    // File Allocation 
    FAT: new Array(BLOCK_COUNT).fill(0)
}
