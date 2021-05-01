const fs = require('fs')
const deletefile = ( filepath)=>{
    fs.unlink(filepath,(err)=>{
        if ( err){
            new Error(err);
        }
    })
}


exports.deletefile = deletefile; 