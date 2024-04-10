const joi = require('joi');

const validarProduto = joi.object({

    descricao: joi.string().trim().required().messages({
        'any.required': 'O campo descricao é obrigatório',
        'string.empty': 'O campo descricao é obrigatório',
        'string.base': 'O campo descricao tem que ser uma string'
    }),

    quantidade_estoque: joi.number().integer().positive().required().messages({
        'any.required': 'O campo quantidade_estoque é obrigatório',
        'number.empty': 'O campo quantidade_estoque é obrigatório',
        'number.base': 'O campo quantidade_estoque tem que ser númerico',
        'number.integer': 'o campo quantidade_estoque precisa ser um número inteiro',
        'number.positive': 'O campo quantidade_estoque precisa ser um número positivo'
    }),

    valor: joi.number().integer().positive().required().messages({
        'any.required': 'O campo valor é obrigatório',
        'number.empty': 'O campo valor é obrigatório',
        'number.base': 'O campo valor tem que ser númerico',
        'number.integer': 'o campo valor precisa ser um número inteiro',
        'number.positive': 'O campo valor precisa ser um número positivo'
    }),

    categoria_id: joi.number().integer().required().messages({
        'any.required': 'O campo categoria_id é obrigatório',
        'number.empty': 'O campo categoria_id é obrigatório',
        'number.base': 'O campo categoria_id tem que ser númerico',
        'number.integer': 'o campo categoria_id precisa ser um número inteiro'
    })
});

module.exports = validarProduto;