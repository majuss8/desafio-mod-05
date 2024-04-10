const jwt = require('jsonwebtoken');
const knex = require('../conexao');
const senhaJwt = process.env.SENHAHASH;

const verificarAutorizacao = async (req, res, next) => {
    const { authorization } = req.headers;

    try {
        if (!authorization) {
            return res.status(401).json({ menssagem: 'não autorizado' })
        };

        const token = authorization.split(' ')[1]
        const { id } = jwt.verify(token, senhaJwt)
        const usuarios = await knex('usuarios').where('id', id)

        if (usuarios.rowCount === 0) {
            return res.status(401).json({ menssagem: 'não autorizado' })
        };

        const { senha, ...usuario } = usuarios[0];

        req.usuario = usuario
        next()

    } catch (error) {
        return res.status(401).json({ menssagem: 'erro de autenticação' })
    }
};

module.exports = verificarAutorizacao;