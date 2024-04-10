const joi = require('joi');

const validarCadastro = joi.object({

    nome: joi.string().trim().required().messages({
        'any.required': 'O campo nome é obrigatório',
        'string.empty': 'O campo nome é obrigatório',
        'string.base': 'o campo nome deve ser um texto'
    }),

    email: joi.string().email().required().messages({
        'any.required': 'O campo email é obrigatório',
        'string.empty': 'O campo email é obrigatório',
        'string.email': 'O campo email precisa ter um email valido',
        'string.base': 'o campo email deve ser um texto'
    }),

    senha: joi.string().min(8).max(30).trim().required().messages({
        'any.required': 'O campo senha é obrigatório',
        'string.empty': 'O campo senha é obrigatório',
        'string.min': 'O campo senha deve conter no mínimo 8 caracteres',
        'string.max': 'O campo senha deve conter no maximo 30 caracteres',
        'string.base': 'o campo senha deve ser um texto'
    })
});

module.exports = validarCadastro;