const joi = require('joi');

const validarAtualizacaoProduto = joi.object({

    descricao: joi.string().required().trim().messages({
        'any.required': 'O campo descricao é obrigatório',
        'string.empty': 'O campo descricao é obrigatório',
        'string.base': 'O campo descricao tem que ser uma string'
    }),

    quantidade_estoque: joi.number().integer().min(0).required().messages({
        'any.required': 'O campo quantidade_estoque é obrigatório',
        'number.empty': 'O campo quantidade_estoque é obrigatório',
        'number.base': 'O campo quantidade_estoque tem que ser númerico',
        'number.integer': 'O campo quantidade_estoque precisa ser um número inteiro',
        'number.min': 'O campo quantidade_estoque não pode ser negativo'
    }),

    valor: joi.number().integer().positive().required().messages({
        'any.required': 'O campo valor é obrigatório',
        'number.empty': 'O campo valor é obrigatório',
        'number.base': 'O campo valor tem que ser númerico',
        'number.integer': 'O campo valor precisa ser um número inteiro',
        'number.positive': 'O campo valor precisa ser um número positivo'
    }),

    categoria_id: joi.number().integer().required().messages({
        'any.required': 'O campo categoria_id é obrigatório',
        'number.empty': 'O campo categoria_id é obrigatório',
        'number.base': 'O campo categoria_id tem que ser númerico',
        'number.integer': 'O campo categoria_id precisa ser um número inteiro'
    }),

    produto_imagem: joi.any().messages({
        'any.empty': 'O campo produto_imagem não pode ficar vazio'
    })
});

module.exports = validarAtualizacaoProduto;