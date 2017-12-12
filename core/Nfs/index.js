// nfs.js
const error = require('./error'); 

/**
 * @description 构造实例  
 * @param {Object} nfs_data
 * @param {Disk} disk
 */
function Nfs(nfs_data, disk){
    this.disk = disk; 
    Object.assign(this, nfs_data); 
}

/**
 * @description 申请一定空间的块  
 * @param {int} size 
 */
Nfs.prototype.fatAlloc = function(size){
    let BLOCK_SIZE = this.disk.BLOCK_SIZE; 
    let need_block = Math.ceil(BLOCK_SIZE / size); 
    
    return this.fatAllocBlock(need_block); 
}

/**
 * @description 申请一定数量的块
 * @param {int} need_block 
 */
Nfs.prototype.fatAllocBlock = function(need_block){
    let FAT = this.FAT; 
    let res = []; 

    for (let i = 0; i < FAT.length; i++){
        let info = FAT[i]; 
        if (info === 0){
            res.push(i); 
        }
        // 如果收集够了就结束 
        if (res.length === need_block){
            break; 
        }
    }

    // 设置 FAT 对应位置为 已占用 
    res.forEach(i => {
        // 已占用 
        FAT[i] = 1; 
    }); 
    return res; 
}

/**
 * @description 释放 fat 
 * @param {Array<int>} A1 
 */
Nfs.prototype.fatRelease = function(A1){
    let FAT = this.FAT; 
    A1.forEach(a => {
        FAT[a] = 0; 
    }); 
}

/**
 * @description 列出文件 
 * @param {String} path_str
 */
Nfs.prototype.ls = function(path_str){
    let path = path_str.split('/').slice(1).filter(e => e);

    return path.reduce((node, cur) => {
        if (!node) return node; 
    
        let remain = node.files.filter(file => file.filename === cur)[0];
        
        return remain; 
    }, this.root); 
}

/**
 * @description 改名 
 * @param {String} path_str
 * @param {String} newFilename
 */
Nfs.prototype.rename = function(path_str, newFilename){
    let file_node = this.ls(path_str); 

    if (!file_node){
        return error(4001, [path_str]);
    } else {
        file_node.filename = newFilename; 
        return this.store2disk(); 
    }
}

/**
 * @description remove file 
 * @param {String} path_str
 */
Nfs.prototype.rm = function(path_str){
    const temp = path_str.lastIndexOf('/')
        , path_dir = path_str.substring(0, temp)
        , filename = path_str.split('/').pop()
        , dir_node = this.ls(path_dir)
        , file_node = this.ls(path_str)

    let notExist = dir_node.files.every(e => e.filename !== filename); 
    if (notExist){
        return error(4001, [path_str]);
    } else {
        // filter 删掉结点 
        dir_node.files = dir_node.files.filter(e => e.filename !== filename); 

        // To Release Data; 
        this.fatRelease(file_node.A1); 

        // 存储 
        return this.store2disk(); 
    }
}

/**
 * @description make it JSON stringify 
 */
Nfs.prototype.toJSON = function(){
    return JSON.stringify({
        root: this.root, 
        FAT: this.FAT
    }); 
}

/**
 * @description store nfs to fake_disk
 */
Nfs.prototype.store2disk = function(){
    const NFS_SIZE = this.disk.NFS_SIZE
        , void_buf = Buffer.alloc(NFS_SIZE, 0, "binary")
        , nfs_buf = Buffer.from(this.toJSON(), "binary");

    let disk_data = Buffer.concat(
        [nfs_buf, void_buf],
        NFS_SIZE
    );

    // fs
    return this.disk.writeRaw(
        disk_data, 0
    ); 
}

/**
 * @description 获取文件所在的区块 
 * @param {Object} node 
 */
Nfs.prototype.getFileIndex = function(node){
    return node.A1; 
}

/**
 * @description 读取某个文件、或者目录 
 * @param {String} path_str 
 */
Nfs.prototype.read = function(path_str){
    let file_node = this.ls(path_str); 

    if (file_node.isDirectory){
        return file_node.files; 
    } else {
        // file_indexs
        return this.disk.readList(
            this.getFileIndex(file_node), 
            file_node.size
        ); 
    }
}

/**
 * @description 覆盖写入数据到某文件、如果是目录则会报错 4002  
 * @param {*} path_str 
 * @param {*} buf_data 
 */
Nfs.prototype.write = function(path_str, buf_data){
    let file_node = this.ls(path_str); 

    // 不是 Buffer 返回 0 
    if (!Buffer.isBuffer(buf_data)) return Promise.resolve(0);
    // 错误 
    if (file_node.isDirectory) return error(4002, [path_str]); 
        
    let BLOCK_SIZE = this.disk.BLOCK_SIZE; 
    let newSize = buf_data.length; 
    let newBlockCount = Math.ceil(newSize / BLOCK_SIZE); 

    let preSize = file_node.size;
    let preBlockCount = Math.ceil(preSize / BLOCK_SIZE); 

    let preA1 = file_node.A1; 
    let deltaCount = newBlockCount - preBlockCount; 

    if (deltaCount >= 0){
        // 连接 申请 增长 
        let inc = this.fatAllocBlock(deltaCount); 
        file_node.A1 = preA1.concat(inc); 
    } else {
        // 截短 释放 缩短 
        file_node.A1 = preA1.slice(0, cha); 
        let toRelease = preA1.slice(cha); 

        this.fatRelease(toRelease); 
    }

    file_node.size = newSize; 

    /**
     * Write Data 
     */
    return this.store2disk().then(ok => {
        return this.disk.writeList(
            file_node.A1, 
            buf_data
        );
    }).catch(err => {
        console.log(err); 
    }); 
    
}

/**
 * @description create a blank file to path_str
 * @param {String} path_str
 * @param {String} ext
 */
Nfs.prototype.touch = function(path_str, ext){
    // let path = path_str.split('/').slice(1).filter(e => e);
    const temp = path_str.lastIndexOf('/')
        , path_dir = path_str.substring(0, temp)
        , filename = path_str.split('/').pop()
        , dir = this.ls(path_dir)

    // Touch 
    let conflict = dir.files.some(e => e.filename === filename); 

    if (conflict){
        return error(4000, [path_str]);
    } else {
        dir.files.push({
            filename, 
            ext, 
            isDirectory: false,
            cTime: Date.now(), 
            size: 0, 
            A1: []
        }); 
    }

    return this.store2disk(); 
}

/**
 * @description 在 node 上创建一个文件夹 
 * @param {Object} node 
 * @param {String} filename 
 */
Nfs.prototype._mkdirOnNode = function(node, filename){
    let dir_node = {
        isDirectory: true,
        cTime: Date.now(), 
        filename: filename, 
        files: []
    }

    node.files.push(dir_node); 

    return dir_node; 
}

/**
 * @description 在 path_str 的父级目录创建文件夹，非递归 
 * @param {String} path_str 
 */
Nfs.prototype.mkdir = function(path_str){
    const temp = path_str.lastIndexOf('/')
        , path_dir = path_str.substring(0, temp)
        , filename = path_str.split('/').pop()
        , dir = this.ls(path_dir)

    // Touch 
    let conflict = dir.files.some(e => e.filename === filename); 

    if (conflict) {
        return error(4000, [path_str]);
    } else {
        this._mkdirOnNode(dir, filename); 
    }

    return this.store2disk(); 
}

/**
 * @description 列出 nfs 磁盘信息
 */
Nfs.prototype.df = function(){
    let {
        DISK_BASE,
        DISK_LOCATION,
        DISK_SIZE,
        BLOCK_SIZE,
        BLOCK_COUNT,
        NFS_SIZE,
        RAW_SIZE
    } = this.disk;

    let df = {
        DISK_BASE,
        DISK_LOCATION,
        DISK_SIZE,
        BLOCK_SIZE,
        BLOCK_COUNT,
        NFS_SIZE,
        RAW_SIZE
    }

    df.REMAIN_SIZE = this.FAT.reduce((sum, cur) => {
        if (cur === 0){
            sum = sum + BLOCK_SIZE; 
        }

        return sum; 
    }, 0); 

    df.USED_SIZE = (df.RAW_SIZE - df.REMAIN_SIZE) + df.NFS_SIZE; 

    return df; 
}

module.exports = Nfs; 
