const jwt = require('jsonwebtoken')
const authConfig = require("../../config/auth.json")

class AuthService {
    constructor() {
        this.secret = authConfig.secret
    }

    authenticate(req, res, next) {
        console.log('ta no authenticate')
        const authHeader = req.headers.authorization

        if(!authHeader)
            return res.status(401).send({error: "No token provided"})
    
        // Bearer sajkdjhasdjkashdjkas
        const parts = authHeader.split(' ')
        if(!parts.length === 2) 
            return res.status(401).send({error: "token error"})
    
        const [ scheme, token ] = parts
    
        if(!/^Bearer$/i.test(scheme))
            return res.status(401).send({error: 'token malformatted'})
    
        jwt.verify(token, authConfig.secret, (err, decoded) => {
            if(err)
                return res.status(401).send({error: 'token invalido'})
            
            req.clienteInfo = {
                idCliente: decoded.id,
                nomeCliente: decoded.nome,
                sobrenomeCliente: decoded.sobrenome,
                emailCliente: decoded.email,
                cpfCliente: decoded.cpf,
                roleCliente: decoded.role,
                senhaCliente: decoded.senha,
                idEndereco: decoded.idEndereco,
                cepCliente: decoded.cep,
                cidadeCliente: decoded.cidade,
                bairroCliente: decoded.bairro,
                logradouroCliente: decoded.logradouro,
                numeroCliente: decoded.numero                
            }
            console.log(req.clienteInfo)
            
            return next()
        })
    }
}

module.exports = AuthService