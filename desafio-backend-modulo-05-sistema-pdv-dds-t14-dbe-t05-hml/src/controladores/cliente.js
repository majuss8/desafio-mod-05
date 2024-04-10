const knex = require('../conexao');

const cadastrarCliente = async (req, res) => {
    const { nome, email, cpf, cep, rua, numero, bairro, cidade, estado } = req.body;

    try {
        const buscarEmail = await knex('clientes').where({ email })

        if (buscarEmail.length > 0) {
            return res.status(400).json({ mensagem: 'email já cadastrado' })
        };

        const buscarCpf = await knex('clientes').where({ cpf })

        if (buscarCpf.length > 0) {
            return res.status(400).json({ mensagem: 'cpf já cadastrado' })
        };

        const novoCliente = await knex('clientes').insert({
            nome: nome.trim(),
            email,
            cpf: cpf.trim(),
            cep: cep ? cep.trim() : 'cep não informado',
            rua: rua ? rua.trim() : 'rua não informada',
            numero,
            bairro: bairro ? bairro.trim() : 'bairro não informado',
            cidade: cidade ? cidade.trim() : 'cidade não informada',
            estado: estado ? estado.trim() : 'estado não informado',
        }).returning('*')

        return res.status(201).json(novoCliente)
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor' });
    }
};

const atualizarCliente = async (req, res) => {
    const { id } = req.params;
    const { nome, email, cpf, cep, rua, numero, bairro, cidade, estado } = req.body;

    try {
        const clienteEncontrado = await knex('clientes').where('id', id)

        if (clienteEncontrado.length === 0) {
            return res.status(404).json({ mensagem: 'Cliente não encontrado' });
        }

        if (email) {

            if (email !== clienteEncontrado[0].email) {
                const emailDuplicado = await knex('clientes').where({ email });

                if (emailDuplicado.length > 0) {
                    return res.status(400).json({ mensagem: "Este email já está cadastrado" });
                }
            }
        }

        if (cpf) {

            if (cpf !== clienteEncontrado[0].cpf) {
                const cpfDuplicado = await knex('clientes').where({ cpf });

                if (cpfDuplicado.length > 0) {
                    return res.status(400).json({ mensagem: "Este cpf já existe" });
                }
            }

        }

        await knex('clientes').update({
            nome: nome.trim(),
            email,
            cpf: cpf.trim(),
            cep: cep ? cep.trim() : 'cep não informado',
            rua: rua ? rua.trim() : 'rua não informada',
            numero,
            bairro: bairro ? bairro.trim() : 'bairro não informado',
            cidade: cidade ? cidade.trim() : 'cidade não informada',
            estado: estado ? estado.trim() : 'estado não informado',
        }).where('id', id)

        return res.status(200).json({ mensagem: 'Cliente atualizado com sucesso.' });
    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor" })
    }
};

const listarClientes = async (req, res) => {
    try {
        const clientes = await knex('clientes').orderBy('id', 'asc');

        if (clientes.length === 0) {
            return res.status(404).json({ mensagem: "Não há clientes cadastrados" });
        }

        return res.status(200).json(clientes);
    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor" })
    }
};

const detalharCliente = async (req, res) => {
    const { id } = req.params;

    try {
        const clienteEncontrado = await knex('clientes').where('id', id);

        if (clienteEncontrado.length === 0) {
            return res.status(404).json({ mensagem: 'Cliente não encontrado!' })
        };

        return res.status(200).json(clienteEncontrado);
    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor" })
    }
};

module.exports = {
    atualizarCliente,
    cadastrarCliente,
    listarClientes,
    detalharCliente
};