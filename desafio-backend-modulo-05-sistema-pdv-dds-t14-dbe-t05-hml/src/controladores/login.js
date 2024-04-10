const knex = require('../conexao');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
    const { email, senha } = req.body;

    try {
        const buscarUsuario = await knex('usuarios').where({ email }).first()

        if (!buscarUsuario) {
            return res.status(400).json({ mensagem: "O usuario não foi encontrado" });
        };

        const senhaCorreta = await bcrypt.compare(senha, buscarUsuario.senha);

        if (!senhaCorreta) {
            return res.status(400).json({ mensagem: "Email e/ou senha não confere" });
        };

        const token = jwt.sign({ id: buscarUsuario.id }, process.env.SENHAHASH, { expiresIn: '8h' });
        const { senha: _, ...dadosUsuario } = buscarUsuario;

        return res.status(200).json({
            usuario: dadosUsuario,
            token
        });
    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor" });
    }
};

module.exports = login;






