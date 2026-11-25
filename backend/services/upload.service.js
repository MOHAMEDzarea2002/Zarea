const cloudinary = require('../config/cloudinary')

const uploadCloudinary = (buffer)=>{
 return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream((error, uploadResult) => {
      if (error) {
        return reject(error)
      }
      return resolve(uploadResult.secure_url)
    }).end(buffer)
  })

}

module.exports = {uploadCloudinary}
