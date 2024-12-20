//lico doig loyl cvwn

const cript = require('bcrypt')
const Cliente = require("../model/Cliente")
const Endereco = require('../model/Endereco')
const Complemento = require('../model/Complemento')
const Produto = require('../model/Produto.js')
const conn = require('../../bd/bd.js')
const jwt = require('jsonwebtoken')
const crypto = require("crypto")
const authConfig = require('../../config/auth.json')
const transporter = require('../../modules/mailer')
const path = require('path')
const fs = require('fs')

function generateToken(params = {}) {
    if (!authConfig.secret) throw new Error('jwt n ta configurado')
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 86400
    })
}

function getCurrentTime(moreTime) {
    const now = new Date();
    const horas = (now.getHours() + moreTime) * 3600
    const minutos = now.getMinutes() * 60
    const time = horas + minutos
    return `${time}`
}

//classe que carrega funções responsaveis por receber, filtrar e enviar os dados para os arquivos model.
class ClienteController {
    constructor(auth) {
        this.auth = auth
    }
    //Cadastra um cliente e seu respectivo endereço
    async enviarInformacoesCliente(req, res) {
        const pessoa = {
            nome: req.body.nome,
            sobrenome: req.body.sobrenome,
            email: req.body.email,
            senha: req.body.password,
            confirmaSenha: req.body.confirmPassword,
            cpf: req.body.cpf,
            cidade: req.body.cidade,
            bairro: req.body.bairro,
            numero: req.body.numero,
            rua: req.body.logradouro,
            cep: req.body.cep,
            nomeComplemento: req.body.complemento,
            role: req.body.role
        }
        //pegando dados do body da url
        let pool;
        let id_complemento = 0;
        let id_endereco = 0;
        let id_cliente = 0;
        let emailUnique = false;
        let cpfUnique = false;
        try {
            console.log(pessoa.senha)
            console.log(pessoa.confirmaSenha)
            //inicia a transaction
            pool = await conn.getConnection()
            await pool.beginTransaction()

            //cria cliente
            pessoa.senha = await cript.hash(pessoa.senha, 10)
            console.log('--------------')
            console.log(pessoa.senha)
            console.log(pessoa.confirmaSenha)
            const clienteObj = new Cliente(pessoa.nome, pessoa.sobrenome, pessoa.email, pessoa.senha, pessoa.cpf, pessoa.role)
            const match = await cript.compare(pessoa.confirmaSenha, pessoa.senha)
            if (
                !match
            ) {
                return res.status(400).send({ error: "Senhas distintas" })
            }
            emailUnique = await clienteObj.emailIsUnique()
            cpfUnique = await clienteObj.cpfIsUnique()
            if (!emailUnique) {
                return res.status(400).send({ error: "Email já cadastrado" })
            }
            if (!cpfUnique) {
                return res.status(400).send({ error: "CPF já cadastrado" })
            }
            id_cliente = await clienteObj.criarCliente.call(clienteObj)

            //cria complemento
            const complementoObj = new Complemento(pessoa.nomeComplemento)
            id_complemento = await complementoObj.criarComplemento.call(complementoObj)
            console.log(id_complemento)
            //cria o endereço
            const enderecoObj = new Endereco(pessoa.cidade, pessoa.cep, pessoa.numero, pessoa.rua, pessoa.bairro, id_cliente)
            id_endereco = await enderecoObj.criaEndereco.call(enderecoObj)
            console.log(id_endereco)
            if (id_endereco == undefined) {
                return res.status(400).send({ error: "Endereço já cadastrado" })
            }

            if (id_complemento)
                await enderecoObj.complementoEndereco.call(enderecoObj, id_complemento)

            //sobe todas as ações pro banco de dados
            await pool.commit()
            res.status(200).send({
                clienteObj
            })
        } catch (error) {
            if (pool) {
                //cancela qualquer alteração no bd
                await pool.rollback()
            }
            console.error('erro ao cadastrar cliente', error)
            res.sendStatus(500)
        }
    }

    async logaCliente(req, res) {
        try {
            const cliente = {
                email: req.body.email,
                senha: req.body.password,
            }

            const clienteOBJ = new Cliente()
            const enderecoOBJ = new Endereco()
            //se o retorno da função for falso, o cliente não existe, então o usuario não é encontrado
            if (!await clienteOBJ.clienteExiste(cliente.email, cliente.senha)) {
                return res.status(401).send({ error: "Usuário não encontrado" })
            }
            const idCliente = clienteOBJ.idCliente
            console.log('id: ', idCliente)
            await enderecoOBJ.obterEnderecoCliente.call(enderecoOBJ, idCliente)
            const nome = clienteOBJ.nome
            const sobrenome = clienteOBJ.sobrenome
            const cpf = clienteOBJ.cpf
            const email = clienteOBJ.email
            const role = clienteOBJ.role
            const senha = clienteOBJ.senha
            console.log('TA LOGANDO OLHA OS DADOS DE ENDEREÇO', enderecoOBJ.rua)
            //caso o usuário seja encontrado, o programa irá retornar o id e o token gerado para esse id
            return res.status(200).send({
                clienteOBJ,
                token: generateToken({
                    id: idCliente,
                    nome: nome,
                    sobrenome: sobrenome,
                    cpf: cpf,
                    email: email,
                    role: role,
                    senha: senha,
                    idEndereco: enderecoOBJ.idEndereco,
                    cep: enderecoOBJ.cep,
                    cidade: enderecoOBJ.cidade,
                    bairro: enderecoOBJ.bairro,
                    logradouro: enderecoOBJ.rua,
                    numero: enderecoOBJ.numero
                })
            })
        } catch (error) {
            console.log(error)
            return res.status(500).send({ error: "erro de servidor" })
        }
    }

    //SE BASEAR NISSO PRA USAR O TOKEN
    async teste(req, res) {
        const nome = req.clienteInfo.nomeCliente
        res.status(200).send({ nome: nome })
    }

    async esqueciSenhaUsuario(req, res) {
        const { email } = req.body
        const clienteOBJ = new Cliente()

        try {
            //encontrar o cliente com o email passado
            const cliente = await clienteOBJ.findClientByEmail(email)
            if (!cliente)
                return res.status(400).send('Cliente não encontrado')

            //gera um token random
            const token = crypto.randomBytes(20).toString('hex')
            const validade = getCurrentTime(1)
            //adiciona ao cliente com tal id, o token e a data de expiração do token
            const idCliente = clienteOBJ.idCliente
            await clienteOBJ.adicionaTokenELimitePorId(token, validade, idCliente)
            //obj de informações do envio do email
            let mailOptions = {
                from: 'codeux.etec@gmail.com',
                to: `${email}`,
                subject: "Recuperação de senha na TBMServCOM",
                text: 'Corpo do email',
                html: `<h1>Recupere sua senha acessando o link abaixo</h1><p><a href="http://127.0.0.1:5500/frontend/Redefinir_Senha.html?tk=${token}">Clique aqui para redefinir sua senha</a></p>`
            }
            //enviar email
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.error(error)
                }
                else {
                    console.log("email enviado: " + info)
                }

            })
            //enviarEmail(email, 'edu.friv10@gmail.com', 'Recuperação de senha', `deu ruim mermao fe deu certo ${clienteOBJ.senhaResetToken}`)
            res.status(200).send({ clienteOBJ })
        } catch (error) {
            console.log("ta dando erro aq eduardo")
            res.status(400).send({ error: error })
        }
    }

    async recuperarSenha(req, res) {
        try {
            const { token, newPassword, confirmPassword } = req.body
            console.log(newPassword + " DISTANCIA " + confirmPassword)

            const clienteOBJ = new Cliente()
            const now = getCurrentTime(0)
            const tokenIsValid = await clienteOBJ.verificaResetToken(token, now)
            if (!tokenIsValid) {
                return res.status(400).send({ error: "Token inválido" })
            }
            const test = await clienteOBJ.resetarSenha(newPassword, confirmPassword)
            console.log(test)
            if (!test) {
                return res.status(400).send({ message: "erro" })
            } else {
                console.log(clienteOBJ.senha)
                return res.status(200).send({ certo: "deu bom" })
            }

        } catch (error) {
            console.error(error)
        }

    }

    async listaTodosProdutos(req, res) {
        const cat = req.query.categoria
        console.log(cat)
        const produto = new Produto();
        console.log(`categoria: ${cat}`)
        try {
            const produtos = await produto.listaTodosProdutos(cat);
            console.log(`produtos: ${produtos}`)
            return res.status(200).json(produtos);
        } catch (error) {
            console.log(`Erro ao listar produtos com imagem: ${error}`)
            return res.status(500).json({ message: "Erro ao listar produtos com imagem", error });
        }
    }


    async exibeUmProduto(req, res) {
        const productId = req.params.id;
        const productFolderPath = path.join(__dirname, '../../upload', `produto_${productId}`);
        const produtoOBJ = new Produto();
        const produtin = await produtoOBJ.preencheProduto(productId)
        console.log("teste do produtin", produtin)
        // Verifica se a pasta do produto existe
        fs.access(productFolderPath, fs.constants.F_OK, (err) => {
            if (err) {
                return res.status(404).json({ message: 'Produto não encontrado ou sem imagens', erro: err.message });
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

                return res.status(200).json({
                    produto: produtin,
                    images: imageUrls
                });
            });
        });
    }

    async dataCliente(req, res) {
        const idCliente = req.clienteInfo.idCliente
        try {
            const nome = req.clienteInfo.nomeCliente
            const sobrenome = req.clienteInfo.sobrenomeCliente
            const cpf = req.clienteInfo.cpfCliente
            const email = req.clienteInfo.emailCliente
            const enderecoOBJ = new Endereco()
            const complementoOBJ = new Complemento()
            await enderecoOBJ.obterEnderecoCliente(idCliente)
            const idComplemento = await complementoOBJ.getComplementoByIdEndereco(enderecoOBJ.idEndereco)
            let complemento
            if (idComplemento != 0) {
                complemento = await complementoOBJ.dataComplemento(idComplemento)
                return res.status(200).send({
                    nome: `${nome}`,
                    sobrenome: `${sobrenome}`,
                    email: `${email}`,
                    cpf: `${cpf}`,
                    logradouro: `${enderecoOBJ.rua}`,
                    cep: `${enderecoOBJ.cep}`,
                    numero: `${enderecoOBJ.numero}`,
                    bairro: `${enderecoOBJ.bairro}`,
                    cidade: `${enderecoOBJ.cidade}`,
                    complemento: `${complemento}`
                })
            } else {
                return res.status(200).send({
                    nome: `${nome}`,
                    sobrenome: `${sobrenome}`,
                    email: `${email}`,
                    cpf: `${cpf}`,
                    logradouro: `${enderecoOBJ.rua}`,
                    cep: `${enderecoOBJ.cep}`,
                    numero: `${enderecoOBJ.numero}`,
                    bairro: `${enderecoOBJ.bairro}`,
                    cidade: `${enderecoOBJ.cidade}`
                })
            }
        } catch (error) {
            return error
        }
    }

    async deletarCliente(req, res) {
        const idCliente = req.clienteInfo.idCliente
        try {
            const clienteOBJ = new Cliente()
            await clienteOBJ.deletarCliente(idCliente)
            return res.status(200).json({message: "Conta deletada"})
        } catch (error) {
            console.log(error.message)
        }
    }

    async atualizarCliente(req, res) {
        let contador = 0
        const idCliente = req.clienteInfo.idCliente
        const idEndereco = req.clienteInfo.idEndereco
        const nome = req.body.nome
        const sobrenome = req.body.sobrenome
        const cpf = req.body.cpf
        const cep = req.body.cep
        const city = req.body.cidade
        const bairro = req.body.bairro
        const rua = req.body.logradouro
        const numero = req.body.numero
        const newComplemento = req.body.complemento
        const endereco = new Endereco()
        const complemento = new Complemento()
        console.log("complemento: ", newComplemento)
        const cliente = new Cliente()
        try {
            const sucesso = await cliente.atualizarDadosCliente(nome, sobrenome, cpf, idCliente)
            if (sucesso) {
                contador += 1
            } else {
                return res.status(404).json({ mensagem: "Cliente não encontrado" })
            }
            const sucesso1 = await endereco.atualizarEnderecoCliente(cep, city, bairro, rua, numero, idEndereco)
            if (sucesso1) {
                contador += 1
            } else {
                return res.status(404).json({ mensagem: "Endereço não encontrado" })
            }
            const sucesso2 = await complemento.atualizaComplementoCliente(idEndereco, newComplemento)
            if (sucesso2) {
                contador += 1
            } else if (contador == 2) {
                return res.status(200).json({ mensagem: "Cliente e endereço atualizados, porém não foi encontrado nenhum complemento" })
            }
            if (contador == 3) {
                return res.status(200).json({ mensagem: "Cliente, endereço e complemento atualizados!!" })
            }
        } catch (error) {
            return res.status(500).json({ error: "Erro ao atualizar dados do Cliente" })
        }
    }
};

module.exports = ClienteController