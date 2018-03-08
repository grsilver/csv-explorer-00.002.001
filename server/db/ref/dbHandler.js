////https://www.sitepoint.com/using-node-mysql-javascript-client/
const mysql = require('mysql');
var dbHandler = {}
module.exports = dbHandler;
var connection;

dbHandler.connect = connect;
dbHandler.query = query;
dbHandler.connect = end;



function connect(){
  connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    //password: 'password',
    database: 'convivaSSD'
  });
  connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to DB');
  });
}

function end(){
  connection.end()
  connection = null;
}


function query(sql,fn){
    if (!connection)
      connect()

    connection.query(sql, (err,rows) => {
      if(err) throw err;
      //console.log('Data received from Db:\n');
      //console.log(rows);
      fn(true,rows)
    });
}
