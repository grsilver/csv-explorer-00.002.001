const forEach = require ('../lib/forEach.js');
const config = require('../../ssd-explorer.config.js');
const query =  require('./query.js');

module.exports = deleteTable;

function deleteTable(paramObj,resolve,reject){
  var sql = `DROP TABLE IF EXISTS ${paramObj.tblName};`
  query.singleQueryPromise(sql)
  .then(resolve)
  .catch(reject)
}
