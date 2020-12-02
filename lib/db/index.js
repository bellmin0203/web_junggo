
const mysql = require('mysql2/promise');
const options = {
  host : process.env.DB_HOST,
  user : process.env.DB_USER,
  password : process.env.DB_PASS,
  port : process.env.DB_PROT,
  database : process.env.DB_NAME,
  dateStrings : 'date'
};
const pool = mysql.createPool(options);

const /** @class */ Connection = ()=> {

  Connection = ()=>{

  }

  const query = (query, prams) => {
    return new Promise((res,rej)=>{
    });
  }
}
