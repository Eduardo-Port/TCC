require('dotenv').config({path: '../.env'})
const cors = require('cors')
const express = require('express');
const app = express();
const clienteRouter = require('./app/routes/cliente_route')
const path = require("path")
app.use(cors())
app.use(cors({
  origin: 'http://127.0.0.1:5500',
  method: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}))

app.use(express.json());
app.use('/upload', express.static(path.join(__dirname, 'upload')));

//envia o express para o arquivo routes, com o intuito de fazer as requisições http
clienteRouter(app);

//metodo do express que inicia o servidor na porta 3000 ou 8081(do .env)
app.listen(process.env.PORT || 3000, () => {
  console.log("Servidor conectado!");
});

