const query = require("./query.js");
const forEach = require ('../lib/forEach.js');
const config = require('../../ssd-explorer.config.js');
module.exports = getDataBaseSize;


function getDataBaseSize(){
  //https://stackoverflow.com/questions/1733507/how-to-get-size-of-mysql-database
  //https://forums.mysql.com/read.php?108,201578,201578
  // https://stackoverflow.com/questions/18014392/select-sql-server-database-size

  var sql = `SELECT
   table_schema as "Database",
   table_name AS "Table",
   round(((data_length + index_length) / 1024 / 1024), 2) "Size in MB"
   FROM information_schema.TABLES
   ORDER BY (data_length + index_length) DESC;`

   return new Promise(function(resolve,reject){
     query.singleQueryPromise(sql)
       .then(function(responseObj){
         try{
           var filteredRows = filterOutTablesNotForApp(responseObj)
           resolve(filteredRows)
         }
         catch(err){
           reject(err)
         }
       })
       .catch(function(err){
         reject(err)
       })
   })
}


function filterOutTablesNotForApp(rows){
  var ary = []
  forEach(rows,function(row){
    if(row.Database == config.database.database){
      ary.push(row)
    }
  })
  return ary
}
