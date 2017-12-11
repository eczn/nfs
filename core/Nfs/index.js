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

    file_node.filename = newFilename; 

    return this.store2disk(); 
}

/**
 * @description remove file 
 * @param {String} path_str
 */
Nfs.prototype.rm = function(path_str){
    const temp = path_str.lastIndexOf('/')
        , path_dir = path_str.substring(0, temp)
        , filename = path_str.split('/').pop()
        , file_node = this.ls(path_dir)
    
    // filter 删掉结点 
    file_node.files = file_node.files.filter(e => e.filename !== filename); 

    // 存储 
    return this.store2disk(); 
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

Nfs.prototype.getFileIndex = function(node){
    let BLOCK_SIZE = this.disk.BLOCK_SIZE; 
    
    if (node.size <= BLOCK_SIZE){
        return [node.A1]; 
    }
}

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
        return Promise.reject(
            error(4000, [path_str])
        ); 
    } else {
        dir.files.push({
            filename, 
            ext, 
            isDirectory: false,
            cTime: Date.now(), 
            size: 0, 
            A1: null, 
            A2: null
        }); 
    }

    return this.store2disk(); 
}



module.exports = Nfs; 
