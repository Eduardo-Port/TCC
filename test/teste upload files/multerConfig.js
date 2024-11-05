const multer = require('multer')
const path = require('path')
const fs = require('fs')

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        const productId = req.params.id
        const productFolderPath = path.join(__dirname, 'upload', `produto_${productId}`)

        if(!fs.existsSync(productFolderPath)) {
            fs.mkdirSync(productFolderPath, {recursive: true})
        }

        callback(null, productFolderPath)
    },
    filename: function (req, file, callback) {
        const productId = req.params.id
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 189)
        callback(null, productId + '-' + uniqueSuffix + path.extname(file.originalname))
    }
})

module.exports = storage