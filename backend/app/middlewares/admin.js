const jwt = require('jsonwebtoken')
const authConfig = require("../../config/auth.json")

class AdminMiddleware {
  constructor() {
    this.secret = authConfig.secret
  }

  adminMiddleware(req, res, next) {
    try {
      if (req.clienteInfo.roleCliente != 'admin') {
        return res.status(401).send({error: "não é um admin"})
      } 
      return next()
    } catch (error) {
      return res.status(403).json({ message: 'Acesso negado' });
    }
  };
}


  
module.exports = new AdminMiddleware()
  