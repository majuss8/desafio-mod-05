const knex = require('../conexao');
const { uploadFile, deleteFile } = require('../storage');

const listarProdutos = async (req, res) => {
    const { categoria_id } = req.query;

    try {
        let produtos;

        if (categoria_id) {
            const categoriaEncontrada = await knex('categorias').where({ id: categoria_id });

            if (!categoriaEncontrada) {
                return res.status(404).json({ mensagem: "Categoria não encontrada" });
            }

            produtos = await knex('produtos')
                .where({ categoria_id: categoria_id })
                .select('produtos.*', 'categorias.nome as categoria_nome');
        } else {
            produtos = await knex('produtos')
                .join('categorias', 'produtos.categoria_id', 'categorias.id')
                .select('produtos.*', 'categorias.nome as categoria_nome');
        }

        return res.status(200).json(produtos);
    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor" });
    }
};

const detalharProduto = async (req, res) => {
    const { id } = req.params;

    try {
        const produtoEncontrado = await knex('produtos').where('id', id);

        if (produtoEncontrado.length === 0) {
            return res.status(404).json({ mensagem: 'Produto não encontrado!' })
        };

        return res.status(200).json(produtoEncontrado);
    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor" });
    }
};

const cadastrarProduto = async (req, res) => {
    try {
        const { descricao, quantidade_estoque, valor, categoria_id } = req.body;
        const { file } = req

        let produto_imagem = null;
        if (file) {
            const arquivo = await uploadFile(
                file.originalname,
                file.buffer,
                file.mimetype
            );
            produto_imagem = arquivo.url;
        }

        const categoria = await knex('categorias')

        if (categoria.length < categoria_id) {
            return res.status(404).json({ mensagem: 'categoria não encontrada' })
        }

        await knex('produtos').insert({
            descricao: descricao.trim(),
            quantidade_estoque, valor,
            categoria_id,
            produto_imagem: produto_imagem ? produto_imagem : "Imagem não fornecida"
        }).returning('*')

        const novoProduto = {
            descricao: descricao.trim(),
            quantidade_estoque,
            valor,
            categoria_id,
            produto_imagem: produto_imagem ? produto_imagem : "Imagem não fornecida"

        }

        return res.status(201).json(novoProduto)
    } catch (error) {
        return res.status(500).json({ mensagem: 'erro interno do servidor' })
    }
};

const atualizarProduto = async (req, res) => {
    const { descricao, quantidade_estoque, valor, categoria_id } = req.body;
    const { id } = req.params;
    const { file } = req

    try {
        const produtos = await knex('produtos').where({ id });
        if (produtos.length === 0) {
            return res.status(404).json({ mensagem: 'produto não encontrado' })
        }

        let produto_imagem = null;
        if (file) {
            const arquivo = await uploadFile(
                file.originalname,
                file.buffer,
                file.mimetype
            );
            produto_imagem = arquivo.url;
        }

        const listarcategorias = await knex('categorias');

        if (listarcategorias.length < categoria_id) {
            return res.status(404).json({ mensagem: 'Categoria não encontrada!' })
        };

        const produtoEncontrado = await knex('produtos').where('id', id);

        if (!produtoEncontrado) {
            return res.status(404).json({ mensagem: 'Produto não encontrado!' })
        };

        await knex('produtos')
            .where({ id })
            .update({
                descricao: descricao.trim(),
                quantidade_estoque,
                valor,
                categoria_id,
                produto_imagem: produto_imagem ? produto_imagem : "Imagem não fornecida"
            });
        const produtoAtualizado = {
            descricao,
            quantidade_estoque,
            valor,
            categoria_id,
            produto_imagem: produto_imagem ? produto_imagem : "Imagem não fornecida"
        };

        return res.status(201).json(produtoAtualizado);
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor' });
    }
};

const excluirProduto = async (req, res) => {
    const { id } = req.params;

    try {
        const produtoEncontrado = await knex('produtos').select('produto_imagem').where('id', id)

        if (produtoEncontrado.length === 0) {
            return res.status(404).json({ mensagem: 'Produto não encontrado' });
        }
        
        if (produtoEncontrado[0].produto_imagem) {
            const file = produtoEncontrado[0].produto_imagem.replace('https://desafio-pdv-01.s3.us-east-005.backblazeb2.com/', '');
            await deleteFile(file);
        }

        const pedidoEncontrado = await knex('pedidos').where({ cliente_id: id })

        if (pedidoEncontrado.length !== 0) {
            return res.status(400).json({ mensagem: "O produto não pôde ser excluído por estar incluso em pedido de cliente" });
        }

        const produtoExcluido = await knex('produtos').del().where('id', id)

        if (produtoExcluido === 0) {
            return res.status(400).json({ mensagem: "O produto não foi excluido" });
        }

        return res.status(200).json({ mensagem: 'Produto excluido com sucesso' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ mensagem: "Erro interno do servidor" })
    }
};

module.exports = {
    cadastrarProduto,
    atualizarProduto,
    excluirProduto,
    listarProdutos,
    detalharProduto
};

