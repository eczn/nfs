// index.js
const init = require('./init')
, fs = require('then-fs')

// Export Disk Construtor 
module.exports = Disk

/**
 * @description Disk 构造函数
 * @param {Object} config 
 */
function Disk(config){
    // this.config = config; 
    Object.assign(this, config);    

    this.ready = new Promise(disk_res => {

    /**
     * 初始化 
     */
    init(this).then(disk_hanle => {
            disk_res('nfs init ok'); 
        }); 
    }); 
}; 

/**
 * @description 读取磁盘上的某个块 
 * @param {int} block_position 
 * @return Promise<Buffer>
 */
Disk.prototype.read = function(block_position = 0){
    let { BLOCK_SIZE, NFS_SIZE } = this; 
    let buf = Buffer.alloc(BLOCK_SIZE, 0); 

    return fs.read(
        // File Descriptor 
        this.disk_fd, 
        // The Target 
        buf,
        // Offset On Buffer 
        0, 
        // Read Legnth 
        BLOCK_SIZE, 
        // Position 
        NFS_SIZE + BLOCK_SIZE * block_position
    ).then(count => {
        return buf; 
    })
}

/**
 * @description 连续读取磁盘上的 N 个块，并拼接返回  
 * @param {Array<int>} block_positions 
 * @param {int} total_size
 * @return Promise<Buffer>
 */
Disk.prototype.readList = function(block_positions, total_size){
    return Promise.all(
        block_positions.map(block_position => {
            return this.read(block_position); 
        })
    ).then(bufs => {
        return Buffer.concat(bufs, total_size); 
    }); 
}

/**
 * @description 将 buf 写入到某个块 
 * @param {int} block_position 
 * @param {Buffer} block_position 
 */
Disk.prototype.write = function(block_position, buf){
    // fs.write(fd, buffer[, offset[, length[, position]]], callback)
    let { BLOCK_SIZE, NFS_SIZE } = this; 

    return fs.write(
        this.disk_fd, 
        buf, 
        0, 
        buf.length, 
        NFS_SIZE + BLOCK_SIZE * block_position
    ); 
}

/**
 * @description 写入 buf 到 block_positions 里 
 * @param {Array<int>} block_positions 
 * @param {Buffer} buf 
 */
Disk.prototype.writeList = function(block_positions, buf){
    let { BLOCK_SIZE } = this; 

    return Promise.all(
        block_positions.map((block_position, i) => {
            let sub_buf = buf.slice(
                i * BLOCK_SIZE,
                (i + 1) * BLOCK_SIZE
            ); 

            return this.write(block_position, sub_buf); 
        })
    ).then(counts => {
        return counts.reduce((sum, count) => sum + count, 0); 
    }); 
}

Disk.prototype.writeRaw = function(buf, position){
    return fs.write(
        this.disk_fd, 
        buf, 
        0, 
        buf.length, 
        position
    ); 
}


/**
 * @description 读取 nfs 元数据 
 */
Disk.prototype.nfsLoad = function(){
    let { NFS_SIZE } = this; 
    let buf = Buffer.alloc(NFS_SIZE, 0); 

    return fs.read(
        // File Descriptor 
        this.disk_fd, 
        // The Target 
        buf,
        // Offset On Buffer 
        0, 
        // Read Legnth 
        NFS_SIZE, 
        // Position 
        0
    ).then(count => {
        var d = buf.toString();

        let i = d.length; 
        
        for (; i >= 0; i --){
            if (d[i] === '}'){
                d = d.slice(0, i + 1); 
                break; 
            }
        }
        
        return JSON.parse(d); 
    }).catch(err => {
        console.log(err); 
        return Promise.reject(err); 
    })
}

