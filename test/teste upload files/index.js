const express = require('express')
const app = express()
const multer = require('multer')
const storage = require('./multerConfig')
const path = require('path')
const fs = require('fs')
const cors = require('cors');
app.use(cors({
    origin: 'http://127.0.0.1:5500',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}))

const upload = multer({storage: storage }).array('file', 10)

app.use('/files', express.static("upload"))

app.post('/produto/:id/upload', (req, res) => {
    const productId = req.params.id

    upload(req, res, function (err) {
        if (err) {
            return res.status(500).json({message: "Erro no upload de imagem", error: err.message})
        }
        res.status(200).json({message: `Imagens do produto ${productId}`}) 
    })
})

app.get('/produto/:id/imagens', (req, res) => {
    const productId = req.params.id;
    const productFolderPath = path.join(__dirname, 'upload', `produto_${productId}`);

    // Verifica se a pasta do produto existe
    fs.access(productFolderPath, fs.constants.F_OK, (err) => {
        if (err) {
            return res.status(404).json({ message: 'Produto não encontrado ou sem imagens' });
        }

        // Lê o conteúdo da pasta (as imagens)
        fs.readdir(productFolderPath, (err, files) => {
            if (err) {
                return res.status(500).json({ message: 'Erro ao ler as imagens' });
            }

            // Filtra apenas arquivos de imagem (jpg, png, etc.)
            const imageFiles = files.filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));

            // Monta URLs das imagens
            const imageUrls = imageFiles.map(file => {
                return `${req.protocol}://${req.get('host')}/upload/produto_${productId}/${file}`;
            });

            return res.status(200).json({ images: imageUrls });
        });
    });
});

app.use('/upload', express.static(path.join(__dirname, 'upload')));
app.listen(3000)