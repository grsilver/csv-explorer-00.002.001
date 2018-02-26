/* knex
http://knexjs.org/
*/
const mysql = require('mysql');
const config = require('../../ssd-explorer.config.js');

var m = module.exports = {};
m.singleQueryPromise = singleQueryPromise

function singleQueryPromise(sql){
  //var sql = "SELECT * FROM SSD1 LIMIT 5"
  return new Promise(function(resolve,reject){

    var connection = mysql.createConnection({
      host: config.database.host,
      user: config.database.user,
      //password: 'password',
      database: config.database.database
    });


    connection.connect((err) => {
      if (err){
        err.message = "queryPromise connection.connect:" + err.message
        reject(err)
      }
    });
    connection.query(sql, (err,rows) => {
      if(err){
        err.message = "queryPromise connection.query:" + err.message
        console.log(err)
        reject(err)
      }
      else{
        end()
        resolve(rows)
      }
    });
    function end(){
      connection.end()
      connection = null;
    }

  })
}
