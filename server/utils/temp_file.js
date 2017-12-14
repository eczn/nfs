// temp_file.js
const fs = require('then-fs')
    , uuid = require('uuid/v4')
    , path = require('path')
    , PUBLIC_TEMP = path.join(__dirname, '../public/temp')

let temp = {};

temp.add = function(buf, ext){
    let toAdd = ext ? `.${ext}` : ''; 

    let fileName = uuid(); 

    return fs.writeFile(
        path.join(PUBLIC_TEMP, fileName + toAdd), 
        buf
    ).then(ok => {
        return `/temp/${fileName}${toAdd}`;
    })
}

module.exports = temp; 
