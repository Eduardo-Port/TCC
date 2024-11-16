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
    
    destination: async (req, file, cb) => {
      const productId = req.params.id; // ID do produto na URL
      const uploadDir = path.join(__dirname, '../../upload', `produto_${productId}`);
    
      try {
        // Log para verificar o caminho completo do diretório
        console.log('Tentando acessar o diretório:', uploadDir);
    
        // Verificar se o diretório existe
        await fs.promises.access(uploadDir, fs.constants.F_OK);
        console.log('Diretório já existe:', uploadDir);
    
        // Se o diretório existe, passar o caminho para o callback
        cb(null, uploadDir);
      } catch (err) {
        // Caso o diretório não exista, tentamos criar
        if (err.code === 'ENOENT') {
          try {
            console.log('Diretório não existe. Tentando criar:', uploadDir);
            await fs.promises.mkdir(uploadDir, { recursive: true });
            console.log('Diretório criado com sucesso:', uploadDir);
            cb(null, uploadDir); // Diretório criado com sucesso
          } catch (mkdirErr) {
            // Log para erro ao criar diretório
            console.error('Erro ao criar diretório:', mkdirErr);
            cb(new Error('Erro ao criar o diretório de upload')); // Passando o erro para o callback
          }
        } else {
          // Log para erro ao verificar a existência do diretório
          console.error('Erro ao verificar o diretório:', err);
          cb(err); // Passa o erro para o callback
        }
      }
    },
    

    filename: async function (req, file, callback) {
      try {
          const productId = req.params.id;
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 189);
          // Se fosse necessário realizar alguma operação assíncrona, aqui seria o lugar.
          
          // Gerar o nome do arquivo
          const fileName = productId + '-' + uniqueSuffix + path.extname(file.originalname);
          
          // Chamar o callback com o nome do arquivo
          callback(null, fileName);
      } catch (error) {
          // Em caso de erro, passamos o erro para o callback
          callback(error);
      }
  }
  
})

module.exports = storage