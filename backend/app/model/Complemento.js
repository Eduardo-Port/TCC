const conn = require('../../bd/bd')
//classe que carrega todos os atributos e métodos que uma entidade pode fazer, que se relacione ou não com o banco de dados
class Complemento {
    constructor(nome, descricao) {
        this.idComplemento = null;
        this.nome = nome;
        this.descricao = descricao;
    }
    //cria um novo complemento no bd
    async criarComplemento() {
        try {
            if (this.nome == undefined || this.descricao == undefined) {
                throw new Error('erro');
            }
            //se o complemento não existe, criar um novo
            if (!await this.complementoExiste(this.nome, this.descricao)) {
                const sql = `INSERT INTO Complemento (compl_nome, compl_descricao) VALUES (?, ?)`;
                const values = [this.nome, this.descricao]
                const [resultComplemento] = await conn.query(sql, values)
                this.idComplemento = resultComplemento.insertId //insertId pega o id do ultimo elemento criado na entidade do bd
                console.log('COMPLEMENTO CRIADO')
                return resultComplemento.insertId
            }
            //se complemento existe, apenas por o id no obj
            console.log('hihih')
            return this.idComplemento
        } catch (error) {
            return console.error("pau ao criar complemento", error.message)
        }
    }

    async complementoExiste(nome, desc) {
        const sql = `SELECT * FROM Complemento WHERE compl_nome = ? AND compl_descricao = ?`
        const values = [nome, desc]
        try {
            const [rows] = await conn.query(sql, values)
            if (!rows.length > 0) {
                return false
            }
            this.idComplemento = rows[0].id_complemento
            return true
        } catch (error) {
            console.log("Deu erro ao verificar se o Complemento existe", error.message)
        }
    }
}

module.exports = Complemento