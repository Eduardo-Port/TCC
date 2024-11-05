const multer = require('multer')
const path = require('path')
const fs = require('fs')

const storage = multer.diskStorage({
    /*destination: function (req, file, callback) {
        const productId = req.params.id
        //definindo o caminho da pasta criada
        const productFolderPath = path.join(__dirname, '../../upload', `produto_${productId}`)

        //cria a pasta caso ela não exista
        if(!fs.existsSync(productFolderPath)) {
            fs.mkdirSync(productFolderPath, {recursive: true})
        }
        callback(null, productFolderPath)
    },*/

    destination: (req, file, cb) => {
        const productId = req.params.id; // Supondo que o ID do produto venha na URL
        const uploadDir = path.join(__dirname, '../../upload', `produto_${productId}`);
    
        // Verificar se a pasta já existe, se não, criá-la
        fs.access(uploadDir, fs.constants.F_OK, (err) => {
          if (err) {
            // A pasta não existe, então criaremos ela
            fs.mkdir(uploadDir, { recursive: true }, (err) => {
              if (err) {
                return cb(new Error('Erro ao criar o diretório de upload'));
              }
              cb(null, uploadDir); // Definir a pasta como destino dos uploads
            });
          } else {
            // A pasta já existe
            cb(null, uploadDir);
          }
        });
      },

    filename: function (req, file, callback) {
        const productId = req.params.id
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 189)
        callback(null, productId + '-' + uniqueSuffix + path.extname(file.originalname))
    }
})

module.exports = storage