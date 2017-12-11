// error.js

let errorTable = {
    "4000": "创建 $$ 的时候发现文件重复", 
    "4001": "$$ 不存在 !"
}

module.exports = function(code, args = []){
    let tpl = errorTable[code].split('$$'); 

    let msg = tpl.reduce((acc, cur, idx) => {
        return acc + cur + (args[idx] || ''); 
    }, ''); 

    return Promise.reject({
        code, 
        msg: msg
    }); 
}