const multer = require('multer')
// initialize storage

const storage = multer.memoryStorage()

// multer
const upload = multer({storage})


const uploadImage = upload.fields([{ name: "mainImage", maxCount: 1 }, { name:"gallery", maxCount: 3 }])



module.exports = {uploadImage}
