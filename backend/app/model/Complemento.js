const conn = require('../../bd/bd')
//classe que carrega todos os atributos e métodos que uma entidade pode fazer, que se relacione ou não com o banco de dados
class Complemento {
    constructor(nome) {
        this.idComplemento = null;
        this.nome = nome;
    }
    //cria um novo complemento no bd
    async criarComplemento() {
        try {
            if (this.nome == undefined) {
                throw new Error('erro');
            }
            //se o complemento não existe, criar um novo
            if (!await this.complementoExiste(this.nome)) {
                const sql = `INSERT INTO Complemento (compl_nome) VALUES (?)`;
                const values = [this.nome]
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

    async complementoExiste(nome) {
        const sql = `SELECT * FROM Complemento WHERE compl_nome = ?`
        const values = [nome]
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

    async getComplementoByIdEndereco(id) {
        const pegaIdComplemento = `SELECT ec.id_complemento
                                   FROM EnderecoComplemento ec
                                   WHERE ec.id_endereco = ?`;
        const values = [id];
    
        try {
            const [result] = await conn.query(pegaIdComplemento, values);
            if (result.length === 0) {
                console.log("Nenhum complemento anexado a este endereço.");
                return 0; // Melhor que lançar um erro genérico
            }
            this.idComplemento = result[0].id_complemento;
            return result[0].id_complemento;
        } catch (error) {
            console.error("Erro ao buscar complemento:", error.message);
        }
    }
    

    async dataComplemento(idComplemento) {
        const sql = 'SELECT * FROM Complemento WHERE id_complemento = ?';
        const val = [idComplemento];
        try {
            const [result] = await conn.query(sql, val);
            if (result.length === 0) { 
                console.log("Nenhum complemento encontrado com esse ID.");
                return;
            }
            this.nome = result[0].compl_nome;
            console.log("Complemento encontrado:", this.nome);
            return this.nome;
        } catch (error) {
            console.error("Erro ao buscar os dados do complemento:", error.message);
        }
    }
    
    

    async atualizaComplementoCliente(idEndereco, complemento) {
        const id = await this.getComplementoByIdEndereco(idEndereco)

        const sql = "UPDATE Complemento SET compl_nome = ? WHERE id_complemento = ?";
        const val = [complemento, id];

        try {
            const [result] = await conn.query(sql, val);
            if (result.affectedRows === 0) {
                console.log("Complemento inexistente.");
                return false;
            }
            console.log("Complemento alterado com sucesso!");
            return true;
        } catch (error) {
            console.error("Erro ao atualizar o complemento: ", error.message);
            return false;
        }
    }

}

module.exports = Complemento