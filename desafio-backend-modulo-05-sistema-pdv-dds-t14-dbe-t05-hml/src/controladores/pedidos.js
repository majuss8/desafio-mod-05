const { Knex } = require('knex');
const knex = require('../conexao');
const transporter = require('../email');

const cadastrarPedido = async (req, res) => {

    try {

        const { cliente_id, pedido_produtos, observacao } = req.body


        const buscarCliente = await knex('clientes').where('id', cliente_id)

        if (buscarCliente.length === 0) {
            return res.status(404).json({ mensagem: 'cliente nao encontrado' })
        }

        let ValorTotal = 0

        for (const item of pedido_produtos) {

            const produto = await knex('produtos').where({ id: item.produto_id }).first()

            if (!produto) {
                return res.status(404).json({ mensagem: `O produto de ID nº ${item.produto_id} não foi encontrado` })
            }

            if (item.quantidade_produto > produto.quantidade_estoque) {
                return res.status(400).json({ mensagem: `O produto de ID nº ${item.produto_id} não possui estoque suficiente. Quantidade em estoque: ${produto.quantidade_estoque}` })
            }

            ValorTotal += produto.valor * item.quantidade_produto
        }

        const pedidoInserido = await knex('pedidos').insert({ cliente_id, observacao, valor_total: ValorTotal }).returning('*')


        let pedidoProdutoCadastrado = []

        for (const item of pedido_produtos) {

            const produto = await knex('produtos').where({ id: item.produto_id }).first()


            const pedidoProduto = await knex('pedido_produtos').insert({ pedido_id: pedidoInserido[0].id, produto_id: item.produto_id, quantidade_produto: item.quantidade_produto, valor_produto: produto.valor }).returning('*')

            await knex('produtos').decrement('quantidade_estoque', item.quantidade_produto).where({ id: item.produto_id })

            pedidoProdutoCadastrado.push({
                id: pedidoProduto[0].id,
                quantidade_produto: item.quantidade_produto,
                pedido_id: pedidoInserido[0].id,
                produto_id: item.produto_id
            })
      
        }

        await transporter.sendMail({
            from: `${process.env.EMAIL_NAME} <${process.env.EMAIL_USER}> `,
            to: `${buscarCliente[0].nome} <${buscarCliente[0].email}>`,
            subject: "Confirmação de pedido ✔",
            text: `Pedido realizado com sucesso prezado ${buscarCliente[0].nome}.`

        });

        const resposta = {
            pedido: pedidoInserido[0],
            pedido_produto: pedidoProdutoCadastrado
        }

        return res.status(201).json(resposta)

    } catch (error) {

        return res.status(500).json({ mensagem: "Erro interno do servidor" });
    }
}

const listarPedidos = async (req, res) => {
    const { cliente_id } = req.query;

    try {
        let pedidos;

        if (cliente_id) {

            pedidos = await knex('pedidos').where({ cliente_id: cliente_id });

            if (pedidos.length === 0) {
                return res.status(404).json({ mensagem: "O cliente não possui pedidos cadastrados." });
            }

            const produtosCliente = await knex('pedido_produtos').whereIn(
                'pedido_id',
                pedidos.map(pedido => pedido.id)
            );

            const pedidosComProdutos = pedidos.map(pedido => {
                const produtosDoPedido = produtosCliente.filter(produto => produto.pedido_id === pedido.id);
                return { pedido, produtosDoPedido };
            });

            return res.status(200).json(pedidosComProdutos);
        } else {

            pedidos = await knex('pedidos');

            const pedidosComProdutos = [];

            for (const pedido of pedidos) {
                const produtosDoPedido = await knex('pedido_produtos').where({ pedido_id: pedido.id });
                pedidosComProdutos.push({ pedido, produtosDoPedido });
            }


            if (pedidosComProdutos.length === 0) {

                return res.status(404).json({ mensagem: "Não há nenhum pedido cadastrado no momento" })
            }

            return res.status(200).json(pedidosComProdutos);
        }
    } catch (error) {

        return res.status(500).json({ mensagem: "Erro interno do servidor" });
    }
}

module.exports = {
    cadastrarPedido,
    listarPedidos
}
