const joi = require('joi');

const validarPedido = joi.object({
    cliente_id: joi.number().required().messages({
        'any.required': 'O campo cliente_id é obrigatório',
        'number.base': 'O campo cliente_id tem que ser númerico'
    }),
    observacao: joi.string().allow('').optional().messages({
        'string.base': 'O campo observacao tem que ser uma string'
    }),

    pedido_produtos: joi.array().min(1).items(
        joi.object({
            produto_id: joi.number().integer().positive().required().messages({
                'any.required': 'O campo produto_id é obrigatório',
                'number.base': 'O campo produto_id tem que ser númerico',
                'number.integer': 'o campo produto_id precisa ser um número inteiro',
                'number.positive': 'O campo produto_id precisa ser um número positivo'
            }),
            quantidade_produto: joi.number().integer().positive().required().messages({
                'any.required': 'O campo quantidade_produto é obrigatório',
                'number.base': 'O campo quantidade_produto tem que ser númerico',
                'number.integer': 'o campo quantidade_produto precisa ser um número inteiro',
                'number.positive': 'O campo quantidade_produto precisa ser um número positivo'
            })
        })
    ).required().messages({
        'any.required': 'O campo pedido_produtos é obrigatório',
        'array.base': 'O campo pedido_produtos precisa ser um array',
        'array.min': 'O campo pedido_produtos precisa ter pelo menos 1(um) produto'
    })
});

module.exports = validarPedido;