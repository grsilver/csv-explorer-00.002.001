/* knex
http://knexjs.org/
*/
const getQueryHandler = require('./getQueryHandler');


module.exports = query;
query.query_api = query_api

function query_api(paramObj){
  return new Promise((resolve,reject)=>{
    query(paramObj.sql)
    .then((rows)=>{
      resolve(rows)
    })
    .catch(reject)
  })
}

function query(sql){
  //var sql = "SELECT * FROM SSD1 LIMIT 5"
  return new Promise(function(resolve,reject){
    getQueryHandler()
    .then(function(queryHandler){
      queryHandler(sql)
      .then(function(rows){
        queryHandler.end()
        resolve(rows)
      })
      .catch(function(err,end){
          queryHandler.end()
        reject(err)
      })
    })
    .catch(reject)
  })
}
