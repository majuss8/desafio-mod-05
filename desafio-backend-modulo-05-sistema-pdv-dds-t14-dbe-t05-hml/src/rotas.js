const express = require('express');

const login = require('./controladores/login');
const verificarAutorizacao = require('./intermediarios/autenticacao');
const listarCategorias = require('./controladores/categorias');

const { cadastrarUsuario, 
        atualizarUsuario, 
        obterPerfil } = require('./controladores/usuarios');

const { cadastrarProduto, 
        listarProdutos, 
        detalharProduto, 
        atualizarProduto, 
        excluirProduto } = require('./controladores/produto');

const { cadastrarCliente, 
      listarClientes, 
     detalharCliente, 
     atualizarCliente } = require('./controladores/cliente');

const validarEsquema = require('./intermediarios/validarEsquema');

const validarCadastro = require('./validacoes/validarCadastro');
const validarLogin = require('./validacoes/validarLogin');
const validarCliente = require('./validacoes/validarClientes');
const validarProduto = require('./validacoes/validarProduto');
const validarPedido = require('./validacoes/validarPedidos');

const validarAtualizacaoUsuario = require('./validacoes/validarAtualizacaoUsuario');
const validarAtualizacaoCliente = require('./validacoes/validarAtualizacaoCliente');
const validarAtualizacaoProduto = require('./validacoes/validarAtualizacaoProduto');

const { cadastrarPedido, listarPedidos } = require('./controladores/pedidos');
const multer = require('./multer');

const rotas = express();

rotas.get('/categoria', listarCategorias);
rotas.post('/usuario', validarEsquema(validarCadastro), cadastrarUsuario);
rotas.post('/login', validarEsquema(validarLogin), login);

rotas.use(verificarAutorizacao);

rotas.get('/usuario', obterPerfil);

rotas.get('/produto', listarProdutos);
rotas.get('/produto/:id', detalharProduto);

rotas.get('/cliente', listarClientes);
rotas.get('/cliente/:id', detalharCliente);

rotas.post('/produto', multer.single('produto_imagem'), validarEsquema(validarProduto), cadastrarProduto)
rotas.post('/cliente', validarEsquema(validarCliente), cadastrarCliente)

rotas.put('/usuario', validarEsquema(validarAtualizacaoUsuario), atualizarUsuario);
rotas.put('/cliente/:id', validarEsquema(validarAtualizacaoCliente), atualizarCliente);
rotas.put('/produto/:id', multer.single('produto_imagem'), validarEsquema(validarAtualizacaoProduto), atualizarProduto);

rotas.delete('/produto/:id', excluirProduto);

rotas.post('/pedido', validarEsquema(validarPedido),cadastrarPedido);
rotas.get('/pedido', listarPedidos);

module.exports = rotas;