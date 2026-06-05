//this file is for multer setup and file validation for resume and self description files



const multer = require('multer');


const upload = multer({
    storage : multer.memoryStorage(),          //store file in memory as buffer
    limits : {
        fileSize : 5 * 1024 * 1024           //limit file size to 5mb
    },
})

module.exports = upload;