const conn = require('../../bd/bd')

//classe que carrega todos os atributos e métodos que uma entidade pode fazer, que se relacione ou não com o banco de dados
class Endereco {
    constructor(cidade, cep, numero, rua, bairro, idCliente, idComplemento) {
        this.idEndereco = null;
        this.cidade = cidade;
        this.cep = cep;
        this.numero = numero;
        this.rua = rua;
        this.bairro = bairro;
        this.idCliente = idCliente
    }

    //insere um novo endereço no banco de dados
    async criaEndereco() {
        try {
            if (!await this.enderecoExiste(this.cep, this.num)) {
                const sql = `INSERT INTO Endereco (end_cidade, end_bairro, end_rua, end_cep, end_numero, id_cliente) VALUES (?, ?, ?, ?, ?, ?)`;
                const values = [this.cidade, this.bairro, this.rua, this.cep, this.numero, this.idCliente]
                const [resultEndereco] = await conn.query(sql, values)
                this.idEndereco = resultEndereco.insertId
                console.log("ENDEREÇO CADASTRADO")
                return this.idEndereco
            }
            return this.idEndereco
        } catch (error) {
            console.log(error)
        }
    }

    async enderecoExiste(cep, num) {
        const sql = `SELECT * FROM Endereco WHERE end_cep = ? AND end_numero = ?`
        const values = [cep, num]
        try {
            const [rows] = await conn.query(sql, values)
            
            // Se não houver resultado, retorna false
            if (rows.length === 0) {
                return false
            }
            
            // Atribui os valores retornados ao objeto
            this.idEndereco = rows[0].id_endereco
            this.cidade = rows[0].end_cidade
            this.cep = rows[0].end_cep
            this.numero = rows[0].end_numero
            this.rua = rows[0].end_rua
            this.bairro = rows[0].end_bairro
            this.idCliente = rows[0].id_cliente
            
            return true
        } catch (error) {
            console.log("Deu erro ao verificar se o Endereco existe", error.message)
        }
    }

    async complementoEndereco(idComplemento) {
        const sql = 'INSERT INTO EnderecoComplemento (id_complemento, id_endereco) VALUES (?, ?);'
        const values = [idComplemento, this.idEndereco]
        try {
            const [rows] = await conn.query(sql, values)
            if (rows.affectedRows == 0) {
                throw new Error('deu erro ao anexar complemento e endereco na tabela associativa')
            } else {
                console.log('COMPLEMENTO CRIADO')
            }
        } catch (error) {
            console.log(error.message)
        }
    }

    async obterEnderecoCliente(id) {
        const sql = `SELECT * FROM Endereco WHERE id_cliente = ?`
        const values = [id]
        try {
            const [rows] = await conn.query(sql, values)
            if (rows.length == 0) {
                throw new Error('Nenhum endereço encontrado')
            }
            this.idEndereco = rows[0].id_endereco;
            this.cidade = rows[0].end_cidade;
            this.cep = rows[0].end_cep;
            this.numero = rows[0].end_numero;
            this.rua = rows[0].end_rua;
            this.bairro = rows[0].end_bairro;
            this.idCliente = rows[0].id_cliente;
        } catch (error) {
            console.log('Erro ao obter o endereço do cliente', error)
        }
    }

    async atualizarEnderecoCliente(cep, cidade, bairro, rua, numero, idEndereco) {
        const sql = `UPDATE Endereco SET end_cep = ?, end_cidade = ?, end_bairro = ?, end_rua = ?, end_numero = ? WHERE id_endereco = ?`;
        const values = [cep, cidade, bairro, rua, numero, parseInt(idEndereco)];

        try {
            const [result] = await conn.query(sql, values);
            if (result.affectedRows === 0) {
                console.log("Nenhum cliente encontrado com esse ID.");
                return false;
            }
            console.log("Dados do cliente atualizados com sucesso.");
            return true;
        } catch (error) {
            console.error("Erro ao atualizar o cliente: ", error);
        }
    }
}

module.exports = Endereco