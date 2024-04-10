create database pdv;

create table usuarios (
	id serial primary key,
  	nome text,
  	email text unique,
  	senha text
);

create table categorias (
	id serial primary key,
  	descricao text
);

insert into categorias (descricao) values
	('Informática'), ('Celulares'), ('Beleza e Perfumaria'),
  	('Mercado'), ('Livros e Papelaria'), ('Brinquedos'),
  	('Moda'), ('Bebê'), ('Games');

create table produtos (
	id serial primary key,
	descricao text,
	quantidade_estoque integer not null,
	valor integer not null,
	categoria_id integer references categorias(id)
);

create table clientes (
	id serial primary key,
  	nome text,
  	email text unique,
  	cpf text unique,
  	cep text,
  	rua text,
  	numero integer,
  	bairro text,
  	cidade text,
  	estado text
);

create table pedidos (
	id serial primary key,
	cliente_id integer references clientes(id),
	observacao text,
	valor_total integer
);

create table pedido_produtos (
	id serial primary key,
  pedido_id integer references pedidos(id),
	produto_id integer references produtos(id),
	quantidade_produto integer,
  valor_produto integer
);

alter table produtos add column produto_imagem text;