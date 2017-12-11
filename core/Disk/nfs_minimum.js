// nfs_minimum.js 
const { BLOCK_COUNT } = require('../../config'); 

module.exports = {
    // F-Tree 
    root: {
        isDirectory: true,
        files: [
            {
                filename: 'hello', 
                ext: 'txt',
                isDirectory: false, 
                cTime: Date.now(), 
                size: 10,
                A1: 0, 
                A2: null
            }
        ]
    }, 
    // File Allocation 
    FAT: (function(){
        let arr = new Array(BLOCK_COUNT).fill(0); 
        arr[0] = 1; 
        return arr; 
    })()
}
