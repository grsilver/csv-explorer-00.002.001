const forEach = require ('../lib/forEach.js');
const config = require('../../ssd-explorer.config.js');
const knex =  require('knex');
//const mariasql =  require('mariasql');
const getMainColumnNames =  require('./getMainColumnNames');

module.exports = cr8TableForSSDImport;


function cr8TableForSSDImport(param){
  console.log("cr8TableForSSDImport.js: Not implemented Yet")

  var knex = require('knex')({
    client: 'mysql',
    connection: {
      host : config.database.host,
      user : config.database.user,
      //password : 'your_database_password',
      database : config.database.database
    }
  });
  return new Promise(function(resolve,reject){

    reject({message"cr8TableForSSDImport.js: Not implemented Yet"})
    /*
    getMainColumnNames(param)
    .then(function(colNamesAry){

      resolve(colNamesAry)
    })
    .catch(function(err){
      reject(err)
    })
    */

  })
}
