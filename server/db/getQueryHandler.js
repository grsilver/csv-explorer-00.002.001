const mysql = require ('mysql');
const forEach = require ('../lib/forEach.js');
const config = require('../../ssd-explorer.config.js');


module.exports = getQueryHandler;

function getQueryHandler(){
  return new Promise(function(resolve,reject){

    var connection = mysql.createConnection({
      host: config.database.host,
      user: config.database.user,
      //password: 'password',
      database: config.database.database
    });

    var ended = false

    if(!connection){
      reject(new Error("Database connection can't be made"))
      return
    }

    connection.connect((err) => {
      if (err){
        end()
        reject(err)
      }
    });

    queryPromise.end = end

    resolve(queryPromise)

    function end(){
      if(ended)
        return
      ended = true

      if(!connection || !connection,end){
        reject(new Error("connection not able to end, probably because none was ever made"))
        return
      }
      connection.end()
      connection = null;
    }

    function queryPromise(sql){
      return new Promise((resolve,reject)=>{
        connection.query(sql, (err,rows) => {
          if(err){
            reject(err)
          }
          else{
            resolve(rows)
          }
        });
      })
    }



  })
}
