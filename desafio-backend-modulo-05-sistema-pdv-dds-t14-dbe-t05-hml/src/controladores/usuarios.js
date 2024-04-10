const knex = require('../conexao');
const bcrypt = require('bcrypt');

const cadastrarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body;

    try {
        const buscarEmail = await knex('usuarios').where({ email })
        const nomeFormatado = nome.trim()

        if (buscarEmail.length > 0) {
            return res.status(400).json({ mensagem: 'email já cadastrado' })
        };

        const senhaCriptografada = await bcrypt.hash(senha, 10);
        const novoUsuario = await knex('usuarios')
        .insert({ nome: nomeFormatado, email, senha: senhaCriptografada })
        .returning('*');

        const { senha: __, ...novoCadastro } = novoUsuario[0]

        return res.status(201).json(novoCadastro)
    } catch (error) {
        return res.status(500).json({ mensagem: 'erro interno do servidor' });
    }
};

const atualizarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body;
    const { id } = req.usuario;

    try {
        const usuarioExistente = await knex('usuarios').where({ id });
        const nomeFormatado = nome.trim()

        if (!usuarioExistente) {
            return res.status(404).json({ mensagem: "Usuário Não existe!" })
        };

        if (email) {
            if (email !== usuarioExistente[0].email) {
                const quantidadeUsuarios = await knex('usuarios').where({ email });

                if (quantidadeUsuarios.length > 0) {
                    return res.status(400).json({ mensagem: "O email já existe" });
                }
            }
        };

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        await knex('usuarios')
            .where({ id })
            .update({
                nome: nomeFormatado,
                email,
                senha: senhaCriptografada
            });

        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor' });
    }
};

const obterPerfil = async (req, res) => {
    return res.status(200).json(req.usuario);
};

module.exports = {
    cadastrarUsuario,
    atualizarUsuario,
    obterPerfil
};