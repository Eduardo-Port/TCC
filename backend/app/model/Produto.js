const conn = require('../../bd/bd')
const fs = require('fs')
const path = require('path')
//classe que carrega todos os atributos e métodos que uma entidade pode fazer, que se relacione ou não com o banco de dados
class Produto {
    constructor(categoria, nome, preco, fichaTecnica) {
        this.idProduto = null;
        this.categoria = categoria;
        this.nome = nome;
        this.preco = preco;
        this.frete = 5.00;
        this.fichaTecnica = fichaTecnica
        this.status = 1;
    }

    //insere um novo endereço no banco de dados
    async criaNovoProdutoComNovaCategoria(categoria) {
        const sqlCategoria = `INSERT INTO Categoria (categoria_prod, categoria_status) VALUES (?, ?);`
        const valuesCategoria = [categoria, this.status]
        try {
            const [resultCategoria] = await conn.query(sqlCategoria, valuesCategoria)
            if (resultCategoria && resultCategoria.affectedRows > 0) {
                this.categoria = resultCategoria.insertId
            }
            const sqlProduto = `INSERT INTO Produto (id_categoria, prod_nome, prod_preco_unit, prod_frete, prod_ficha, prod_status) VALUES (?, ?, ?, ?, ?, ?)`
            const valuesProduto = [this.categoria, this.nome, this.preco, this.frete, this.fichaTecnica, this.status]
            const [resultProduto] = await conn.query(sqlProduto, valuesProduto)
            if (resultProduto && resultProduto.affectedRows > 0) {
                this.idProduto = resultProduto.insertId
            }
            console.log(this.idProduto)
        } catch (error) {
            console.error(error)
        }
    }

    async criaNovoProdutoSemNovaCategoria() {
        const sqlProduto = `INSERT INTO Produto (id_categoria, prod_nome, prod_preco_unit, prod_frete, prod_ficha, prod_status) VALUES (?, ?, ?, ?, ?, ?)`
        const valuesProduto = [this.categoria, this.nome, this.preco, this.frete, this.fichaTecnica, this.status]
        try {
            const [resultProduto] = await conn.query(sqlProduto, valuesProduto)
            if (resultProduto && resultProduto.affectedRows > 0) {
                this.idProduto = resultProduto.insertId
            }
            console.log(this.idProduto)
        } catch (error) {
            console.error(error)
        }
    }

    async categoriaExiste(categoria) {
        const sql = `SELECT * FROM Categoria WHERE categoria_prod = ?;`
        const values = [categoria];

        try {
            if (!categoria || categoria.trim() === "") {
                throw new Error("Categoria inválida fornecida");
            }

            const [rows] = await conn.query(sql, values);

            if (rows.length > 0) {
                return true;
            }
            return false;
        } catch (error) {
            console.error("Erro em categoriaExiste:", error.message);
            throw error;
        }
    }


    async descobreIdCategoria(categoria) {
        const sql = `SELECT id_categoria, categoria_status FROM Categoria WHERE categoria_prod = ?`;
        const values = [categoria];
        try {
            const [rows] = await conn.query(sql, values);
            
            if (rows.length < 1) {
                return;
            }
    
            // Pegando o id_categoria da primeira linha retornada
            const idCategoria = rows[0].id_categoria;
            const categoriaStatus = rows[0].categoria_status;
    
            // Verificando o status da categoria
            if (categoriaStatus === 1) {
                return idCategoria;  // Retorna o id_categoria se a categoria estiver ativa
            } else {
                throw new Error("Categoria está inativa");
            }
        } catch (error) {
            console.error("Erro ao descobrir id da categoria: " + error.message);
            throw error;  // Propaga o erro para que o controller ou outra parte do código o trate
        }
    }
    

    async nomeProdutoExiste(nome) {
        const sql = `SELECT * FROM Produto WHERE prod_nome = ?;`
        const values = [nome]
        try {
            const [rows] = await conn.query(sql, values)
            if (rows.length < 1) {
                return false
            }
            return true
        } catch (error) {
            console.error(error)
        }
    }

    async verificaStatusCategoria(categoria) {
        const sql = `SELECT * FROM Categoria WHERE categoria_prod = ?;`
        const value = [categoria]
        try {
            const [rows] = await conn.query(sql, value)
            this.categoria = rows[0].id_categoria
            if (rows[0].categoria_status == 1)
                return 0
            else
                return 1
        } catch (error) {
            console.error('erro ao verificar status categoria: ' + error)
        }
    }

    async verificaStatusProduto(nome) {
        const sql = `SELECT id_produto, prod_status, id_categoria FROM Produto WHERE id_categoria = ? AND prod_nome = ?;`
        const value = [this.categoria, nome]
        try {
            const [rows] = await conn.query(sql, value)
            if (rows.length == 0)
                throw new Error('Produto não encontrado')
            this.idProduto = rows[0].id_produto

            if (rows[0].prod_status == 1)
                return 0
            else
                return 1
        } catch (error) {
            console.error('erro ao verificar status Produto: ' + error)
        }
    }

    async mudarStatusProduto(status, id) {
        const sql = `UPDATE Produto SET prod_status = ? WHERE id_produto = ?`
        console.log(status, id)
        const values = [status, id]
        try {
            const [result] = await conn.query(sql, values)
            if (result.affectedRows === 0) {
                throw new Error('Nenhuma alteração feita no bd ao mudar status do Produto')
            }
            console.log('Status do produto atualizado com sucesso')
        } catch (error) {
            console.error("Erro ao mudar status do Produto: " + error.message)
        }
    }

    async listaTodosProdutos() {
        const sql = `SELECT id_produto AS id, prod_nome AS nome, prod_preco_unit AS preco FROM Produto WHERE prod_status = 1`

        try {
            const [rows] = await conn.query(sql);

            const produtosComImagem = rows.map(produto => {
                const pastaImagens = path.join(__dirname, `../../upload/produto_${produto.id}`);
                let imagem = null;

                // Verifica se a pasta existe e seleciona a primeira imagem como representativa
                if (fs.existsSync(pastaImagens)) {
                    const arquivos = fs.readdirSync(pastaImagens);
                    if (arquivos.length > 0) {
                        imagem = path.join(`produto_${produto.id_produto}`, arquivos[0]);
                    }
                }

                return {
                    ...produto,
                    imagem
                };
            });

            return produtosComImagem;
        } catch (error) {
            throw error;
        }
    }

    async produtoExiste(id) {
            const sql = `SELECT * FROM Produto WHERE id_produto = ?`
            const values = [id]
            try {
                const [rows] = await conn.query(sql, values)
                if (rows.length > 1)
                    throw new Error("ID enviado pertence a um produto existente")
                this.idProduto = rows[0].id_produto
                return false
            } catch (error) {
                return true
            }
        }
    }

module.exports = Produto