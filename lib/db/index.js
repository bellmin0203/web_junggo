const mysql = require('sync-mysql');
const options = {
  host : process.env.DB_HOST,
  user : process.env.DB_USER,
  password : process.env.DB_PASS,
  port : process.env.DB_PROT,
  database : process.env.DB_NAME,
  dateStrings : 'date'
};

const connection = new mysql(options);

module.exports = connection;