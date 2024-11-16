const Produto = require('../model/Produto.js')
const path = require('path')
const fs = require('fs')

class AdminController {
    async cadastraProduto(req, res) {
        const { categoria, nome, preco, ficha } = req.body

        try {
            //instancia feita apenas para descobrir o id da categoria enviada
            const achadorDeCategoria = new Produto()
            console.log("A CATEGORIA DO PRODUTO É: ", categoria)
            const idCategoria = await achadorDeCategoria.descobreIdCategoria(categoria)
            console.log("A CATEGORIA DO PRODUTO É: ", idCategoria)
            const produto = new Produto(idCategoria, nome, preco, ficha)
            //verificação da categoria
            if (await produto.categoriaExiste(categoria)) {
                console.log("categoria existe")
                if (await produto.nomeProdutoExiste(nome)) {
                    return res.status(400).json({ message: "Produto já existe" })
                }
                await produto.criaNovoProdutoSemNovaCategoria()
            } else {
                await produto.criaNovoProdutoComNovaCategoria(categoria)
            }
            return res.status(201).json({ message: "Produto cadastrado com sucesso: ", produto })
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erro ao cadastrar produto", error: error.message });
        }
    }

    async inativarProduto(req, res) {
        const data = {
            idCategoria: req.body.categoria,
            idNome: req.body.id
        }

        try {
            //instancia do produto que vai verificar o status da categoria e do produto
            const produto = new Produto()
            //variavel q vai armazenar o contrário do status de categoria q foi armazenado no banco de dados
            const categoriaAtual = await produto.verificaStatusCategoria(data.idCategoria)
            /*if (!categoriaAtual) {
                return res.status(404).json({ message: "Categoria não encontrada" })
            }*/

            if(await produto.productIsUniqueInCategory(data.idCategoria)) {
                await produto.mudarStatusCategoria(categoriaAtual, data.idCategoria)
            }
            //variavel q armazena o contrario do armazenado no status do produto no banco de dados
            const statusAtual = await produto.verificaStatusProduto(data.idNome)
            if (statusAtual === undefined) {
                return res.status(404).json({ message: "Produto não encontrado" })
            }
            const novoStatus = await produto.mudarStatusProduto(statusAtual, data.idNome)
            return res.status(201).json({ message: "Status do produto atualizado", novoStatus })
        } catch (error) {
            return res.status(500).json({ message: "Erro ao atualizar status do produto: ", error: error.message })
        }
    }

    uploadImagensProduto(req, res) {
        if(!req.files) {
            return res.status(400).json({message: "Nenhuma imagem enviada"})
        }
        const productId = req.params.id
        return res.status(200).json({message: `Imagens do produto ${productId}`})
    }
}

module.exports = new AdminController()