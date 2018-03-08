const forEach = require ('../lib/forEach.js');
const config = require('../../ssd-explorer.config.js');
const getQueryHandler =  require('./getQueryHandler.js');
const listTables =  require('./listTables.js');

module.exports = checkIfTableExists;

function checkIfTableExists(paramObj){
  //paramObj.tblName;
  //paramObj.queryHandler
  //paramObj.endConnection // fn
  return new Promise((resolve,reject)=>{

    listTables(paramObj)
    .then((tblRows)=>{
      var exists = forEach(tblRows,(tblRow,i,brk4Each)=>{
        if(tblRow.Table == paramObj.tblName){
          brk4Each(true)
        }
      })
      resolve(exists || false)
    })
    .catch(reject)

  })
}
