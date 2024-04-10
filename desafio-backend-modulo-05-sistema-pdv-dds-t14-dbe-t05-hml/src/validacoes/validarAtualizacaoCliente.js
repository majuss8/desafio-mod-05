const joi = require('joi');

const validarAtualizacaoCliente = joi.object({

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

    cpf: joi.string().min(11).max(11).trim().required().messages({
        'any.required': 'O campo cpf é obrigatório',
        'string.empty': 'O campo cpf é obrigatório',
        'string.min': 'O campo cpf deve conter 11 caracteres',
        'string.max': 'O campo cpf deve conter 11 caracteres',
        'string.base': 'o campo cpf deve ser um texto'
    }),

    cep: joi.string().min(8).max(8).trim().messages({
        'string.base': 'O campo CEP deve ser uma string',
        'string.min': 'O campo CEP deve conter 8 caracteres',
        'string.max': 'O campo CEP deve conter 8 caracteres',
    }),

    rua: joi.string().trim().messages({
        'string.base': 'O campo RUA deve ser uma string'

    }),

    numero: joi.string().trim().messages({
        'string.base': 'O campo NÚMERO deve ser uma string'
    }),

    bairro: joi.string().trim().messages({
        'string.base': 'O campo BAIRRO deve ser uma string'
    }),

    cidade: joi.string().trim().messages({
        'string.base': 'O campo CIDADE deve ser uma string'
    }),

    estado: joi.string().trim().messages({
        'string.base': 'O campo ESTADO deve ser uma string'
    })
});

module.exports = validarAtualizacaoCliente