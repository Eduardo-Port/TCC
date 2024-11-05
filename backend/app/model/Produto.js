const conn = require('../../bd/bd')

//classe que carrega todos os atributos e métodos que uma entidade pode fazer, que se relacione ou não com o banco de dados
class Produto {
    constructor(categoria, nome, preco, fichaTecnica) {
        this.idProduto = null;
        this.categoria = categoria;
        this.nome = nome;
        this.preco = preco;
        this.frete = 5.00;
        this.fichaTecnica = fichaTecnica
        this.status;
    }

    //insere um novo endereço no banco de dados
    async criaNovoProdutoComNovaCategoria(categoria) {
        const sqlCategoria = `INSERT INTO Categoria (categoria_prod, categoria_status) VALUES (?, ?);`
        const valuesCategoria = [categoria, this.status]
        try {
            const [resultCategoria] = await conn.query(sqlCategoria, valuesCategoria)
            if(resultCategoria && resultCategoria.affectedRows > 0) {
                this.categoria = resultCategoria.insertId
            }
            const sqlProduto = `INSERT INTO Produto (id_categoria, prod_nome, prod_preco_unit, prod_frete, prod_ficha) VALUES (?, ?, ?, ?, ?)`
            const valuesProduto = [this.categoria, this.nome, this.preco, this.frete, this.fichaTecnica]
            const [resultProduto] = await conn.query(sqlProduto, valuesProduto)
            if(resultProduto && resultProduto.affectedRows > 0) {
                this.idProduto = resultProduto.insertId
            }
            console.log(this.idProduto)
        } catch (error) {
            console.error(error)
        }
    }

    async criaNovoProdutoSemNovaCategoria() {
        const sqlProduto = `INSERT INTO Produto (id_categoria, prod_nome, prod_preco_unit, prod_frete, prod_ficha) VALUES (?, ?, ?, ?, ?)`
        const valuesProduto = [this.categoria, this.nome, this.preco, this.frete, this.fichaTecnica]
        try {
            const [resultProduto] = await conn.query(sqlProduto, valuesProduto)
            if(resultProduto && resultProduto.affectedRows > 0) {
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
        const sql = `SELECT id_categoria FROM Categoria WHERE categoria_prod = ?`
        const values = [categoria]
        try {
            const [rows] = await conn.query(sql, values)
            if (rows.length < 1) 
                throw new Error("Categoria não existe")
            this.categoria = rows[0].id_categoria
            if(rows[0].categoria_status == 1) 
                return 1
            else 
                return 0
        } catch (error) {
            console.error("erro ao descobrir id categoria: " + error)
        }
    }

    async nomeProdutoExiste(nome) {
        const sql = `SELECT * FROM Produto WHERE prod_nome = ?;`
        const values = [nome]
        try {
            const [rows] = await conn.query(sql, values)
            if(rows.length < 1) {
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
            if(rows[0].categoria_status == 1) 
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
            if(rows.length == 0)
                throw new Error('Produto não encontrado')
            this.idProduto = rows[0].id_produto
 
            if(rows[0].prod_status == 1) 
                return 0
            else 
                return 1
        } catch (error) {
            console.error('erro ao verificar status Produto: ' + error)
        }
    }

    async mudarStatusProduto(status) {
        const sql = `UPDATE Produto SET prod_status = ? WHERE id_produto = ?`
        console.log(this.idProduto)
        const values = [status, this.idProduto]
        try {
            const [result] = await conn.query(sql, values)
            if(result.affectedRows === 0) {
                throw new Error('Nenhuma alteração feita no bd ao mudar status do Produto')
            }
            console.log('Status do produto atualizado com sucesso')
        } catch (error) {
            console.error("Erro ao mudar status do Produto: " + error.message)
        }
    }

    async produtoExiste(id) {
        const sql = `SELECT * FROM Produto WHERE id_produto = ?`
        const values = [id]
        try {
            const [rows] = await conn.query(sql, values)
            if(rows.length != 0)
                throw new Error ("ID enviado pertence a um produto existente")
            this.idProduto = rows[0].id_produto
            return false
        } catch (error) {
            return true            
        }
    }
}

module.exports = Produto