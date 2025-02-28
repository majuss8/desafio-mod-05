const knex = require('knex')({
    client: 'pg',
    connection: {
        host: process.env.HOST,
        port: process.env.DB_PORT,
        user: process.env.USER,
        password: process.env.PASS,
        database: process.env.DATABASE,
        ssl: { rejectUnauthorized: false }
    }
});

module.exports = knex;