const conn = require('../../bd/bd')
const bcrypt = require('bcrypt')
//classe que carrega todos os atributos e métodos que uma entidade pode fazer, que se relacione ou não com o banco de dados
class Cliente {
    constructor(nome, sobrenome, email, senha, cpf, role) {
        this.idCliente = null;
        this.nome = nome;
        this.sobrenome = sobrenome;
        this.email = email;
        this.senha = senha;
        this.cpf = cpf;
        this.senhaResetToken;
        this.senhaResetExpire;
        this.role = role;
    }

    //insere um novo Cliente no banco de dados
    async criarCliente() {
        const sql = `INSERT INTO Cliente (cli_nome, cli_sobrenome, cli_email, cli_senha, cli_cpf, cli_role) VALUES (?, ?, ?, ?, ?, ?)`;
        const values = [this.nome, this.sobrenome, this.email, this.senha, this.cpf, this.role];
        try {
            const [result] = await conn.query(sql, values);

            // verifica se a inserção deu certo
            if (result && result.affectedRows > 0) {
                this.idCliente = result.insertId; // acessa o id do cliente inserido
                console.log('Resultado da inserção do cliente: ' + this.idCliente);
                return this.idCliente; // retorna o id do cliente
            } else {
                throw new Error('Inserção falhou');
            }
        } catch (error) {
            console.error('Erro ao criar cliente:', error);
            throw error; // lança o erro para ser tratado em outro lugar
        }

    }

    async clienteExiste(email, senha) {
        const sql = `SELECT id_cliente, cli_email AS email, cli_senha AS senha, cli_nome AS nome, cli_sobrenome AS sobrenome, cli_cpf AS cpf, cli_role AS role FROM Cliente;`;
        const [rows, results] = await conn.query(sql);

        for (const row of rows) {
            const result = await bcrypt.compare(senha, row.senha);
            if (row.email == email && result) {
                this.idCliente = row.id_cliente
                this.nome = row.nome
                this.sobrenome = row.sobrenome
                this.email = row.email
                this.cpf = row.cpf
                this.role = row.role
                this.senha = row.senha
                console.log('logado');
                return true;
            }
        }
        return false;
    }

    async emailIsUnique() {
        const sql = `SELECT cli_nome FROM Cliente WHERE cli_email = ?`
        const value = this.email
        const [rows] = await conn.query(sql, value)
        if (rows.length > 0) {
            return false
        }
        return true
    }

    async cpfIsUnique() {
        const sql = `SELECT cli_nome FROM Cliente WHERE cli_cpf = ?`
        const value = [this.cpf]
        const [rows] = await conn.query(sql, value)
        if (rows.length > 0) {
            return false
        }
        return true
    }

    async findClientByEmail(email) {
        const sql = 'SELECT id_cliente, cli_email FROM Cliente WHERE cli_email = ?'
        const value = [email]
        try {
            const [rows] = await conn.query(sql, value)
            if (rows.length > 0) {
                this.idCliente = rows[0].id_cliente
                return true
            }
            return false
        } catch (error) {
            console.log('Erro ao encontrar o cliente pelo email: ' + error)
        }
    }

    async adicionaTokenELimitePorId(token, validade, id) {
        const sql = `UPDATE Cliente SET token_reset_senha = ?, data_expired_token = ? WHERE id_cliente = ?`
        this.senhaResetToken = token
        this.senhaResetExpire = validade
        const values = [this.senhaResetToken, this.senhaResetExpire, id]
        await conn.query(sql, values, (err, results) => {
            if (err) {
                console.error("Erro ao adicionar TOKEN", err)
                return
            }
            console.log('TOKEN de senha cadastrado com sucesso: ', this.senhaResetToken)
        })
    }

    async verificaResetToken(email, token, validade) {
        try {
            const sql = `SELECT id_cliente as id, cli_email as email, token_reset_senha as token, data_expired_token as token_expired FROM Cliente WHERE cli_email = ?;`
            const values = [email]
            const [rows] = await conn.query(sql, values)
            if (rows.length > 0) {
                this.idCliente = rows[0].id
                this.email = rows[0].email
                this.senhaResetToken = rows[0].token
                this.senhaResetExpire = rows[0].token_expired
                if (!token == this.senhaResetToken) {
                    return false
                }
                if (validade > this.senhaResetExpire) {
                    return false
                }
                return true
            }
        } catch (error) {
            console.log("deu erro ao verificar o reset token" + error)
        }
    }

    async resetarSenha(newPass, confirmPass) {
        const sql = "UPDATE Cliente SET cli_senha = ? WHERE id_cliente = ?"
        const sql2 = "UPDATE Cliente SET token_reset_senha = ?, data_expired_token = ? WHERE id_cliente = ?;"
        console.log(this.idCliente)
        try {
            // Verifica se a nova senha e a confirmação da senha coincidem
            if(!this.senhaÉIgual(newPass, confirmPass)) {
                return false
            }

            const newPassword = await bcrypt.hash(newPass, 10)
            // Substitui a senha no array de valores com o hash
            const values = [newPassword, this.idCliente];
            this.senha = newPassword
            // Executa a query para atualizar a senha no banco de dados
            await conn.query(sql, values);
            values2 = [null, null, this.idCliente]
            await conn.query(sql2, values2)
            //await conn.query(sql2, values2)
            console.log("Senha atualizada com sucesso.");
            return true;
        } catch (error) {
            console.error("Erro ao atualizar a senha:", error);
            return false;
        }
    }

    async senhaÉIgual(pass, confirmPass) {
        if (pass == "" || confirmPass == "") {
            console.error("Senhas não podem ser vazias.");
            return false;
        }

        if (pass !== confirmPass) {
            console.error("Senhas não coincidem.");
            return false;
        }
        return true;
    }

    async findClientById(id) {
        const sql = 'SELECT cli_nome AS nome, cli_sobrenome AS sobrenome, cli_senha AS senha, cli_cpf AS cpf, cli_role AS role FROM Cliente WHERE id_cliente = ?'
        const value = [id]
        try {
            const [rows] = await conn.query(sql, value)
            if (rows.length > 0) {
                this.nome = rows[0].nome
                this.sobrenome = rows[0].sobrenome
                this.senha = rows[0].senha
                this.cpf = rows[0].cpf
                this.role = rows[0].role
                return true
            }
            return false
        } catch (error) {
            console.log('Erro ao encontrar o cliente pelo email: ' + error)
        }
    }

    async deletarCliente(id) {   
        const sql3 = `SELECT id_endereco AS endereco FROM endereco WHERE id_cliente = ?`
        const sql1 = `SELECT id_complemento AS complemento FROM EnderecoComplemento WHERE id_endereco = ?`
        const sql = `DELETE FROM Cliente WHERE cliente_id = ?` 
        const values = [id]
        const sql2 = `DELETE FROM Complemento WHERE id_complemento = ?`
        const endereco = []
        const idComplemento = []
        try {
            const [rows1] = await conn.query(sql3, values)
            if(rows1.length == 0) {
                throw new Error('Cliente não foi encontrado')
            } else {
                console.log(rows1[0].endereco)
                endereco.push(rows1[0].endereco)
            }
            const [rows2] = await conn.query(sql1, endereco[0])
            if(rows2.length == 0) {
                throw new Error('Complemento não encontrado')
            } else {
                idComplemento.push(rows2[0].complemento)
            }
            const [rows] = await conn.query(sql, values)
            if(rows.length == 0) {
                throw new Error('Erro ao deletar Cliente')
            } else {
                console.log('Cliente deletado com Sucesso')
            }
            const [rows3] = await conn.query(sql2, idComplemento)
            if(rows3.length == 0) {
                throw new Error('Erro ao deletar complemento')
            } else {
                console.log('Complemento deletado com sucesso')
            }
        } catch (error) {
            console.log('Erro ao deletar informações do cliente: ', error.message)
        }
    }
}

module.exports = Cliente
