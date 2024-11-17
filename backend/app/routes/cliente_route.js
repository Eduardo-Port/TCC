const adminService = require('../middlewares/admin')
const adminController = require('../controller/AdminController')
const ClienteController = require('../controller/ClienteController');
const AuthService = require("../middlewares/auth")
const authService = new AuthService()
const clienteController = new ClienteController(authService)

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Apenas imagens são permitidas'));
  }
};
const storage = require('../middlewares/mutler.js')
const multer = require('multer');
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 40 * 1024 * 1024, // 10MB (ajuste conforme necessário)
  },
})
const path = require('path');
const express = require('express');
//função que executa requisições http referente ao cliente
function ClienteRoutes(app) {
  //cadastra um novo cliente com seu endereço e complemento
  app.post('/registrar', clienteController.enviarInformacoesCliente);

  //loga cliente
  app.post('/login', clienteController.logaCliente);

  app.post('/esqueceu_senha', clienteController.esqueciSenhaUsuario);

  app.put('/nova_senha', clienteController.recuperarSenha)

  //se basear nisso pra usar os token jwt

  app.post('/cadastra_produto',
    (req, res, next) => authService.authenticate(req, res, next),
    (req, res, next) => adminService.adminMiddleware(req, res, next),
    (req, res) => adminController.cadastraProduto(req, res)
  )

  app.put('/inativar_produto',
    (req, res, next) => authService.authenticate(req, res, next),
    (req, res, next) => adminService.adminMiddleware(req, res, next),
    (req, res) => adminController.inativarProduto(req, res)
  )

  app.put('/atualizar_dados',
    (req, res, next) => authService.authenticate(req, res, next),
    (req, res) => clienteController.atualizarCliente(req, res)
  )

  app.post('/cadastra_produto/:id/upload',
    (req, res, next) => authService.authenticate(req, res, next),
    (req, res, next) => adminService.adminMiddleware(req, res, next),
    upload.array('file', 10),
    (req, res) => adminController.uploadImagensProduto(req, res)
  )

  app.get('/listar_produtos',
    (req, res) => clienteController.listaTodosProdutos(req, res)
  )

  app.get('/exibe_produto/:id', clienteController.exibeUmProduto)

  app.get('/minha_conta',
    (req, res, next) => authService.authenticate(req, res, next),
    (req, res) => clienteController.dataCliente(req, res)
  )

  app.get('/', (req, res, next) => authService.authenticate(req, res, next), (req, res) => clienteController.teste(req, res))

  app.get('/produto/:id/imagens',
    (req, res) => clienteController.listaImagensProduto(req, res)
  )

  app.delete('/deletar_conta',
    (req, res, next) => authService.authenticate(req, res, next),
    (req, res) => clienteController.deletarCliente(req, res)
  )
}

module.exports = ClienteRoutes