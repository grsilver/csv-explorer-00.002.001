const getQueryHandler = require('./getQueryHandler.js');
const forEach = require ('../lib/forEach.js');
const config = require('../../ssd-explorer.config.js');

module.exports = listTables;


function listTables(paramObj){
  //paramObj.queryHandler
  //paramObj.end // fn

  //https://stackoverflow.com/questions/1733507/how-to-get-size-of-mysql-database
  //https://forums.mysql.com/read.php?108,201578,201578
  // https://stackoverflow.com/questions/18014392/select-sql-server-database-size

  return new Promise(function(resolve,reject){

    if(paramObj.queryHandler){
      callSql(paramObj.queryHandler)
    }
    else {
      getQueryHandler().then(callSql).catch(reject)
    }

    function callSql(queryHandler){
      var sql = `SELECT
       table_schema as "Database",
       table_name AS "Table",
       round(((data_length + index_length) / 1024 / 1024), 2) "Size in MB"
       FROM information_schema.TABLES
       ORDER BY (data_length + index_length) DESC;`

      queryHandler(sql).then((unfilteredRows)=>{
        if(!paramObj.queryHandler)
          queryHandler.end()

        var filteredRows = filterOutTablesNotForApp(unfilteredRows)
        resolve(filteredRows)

      })
      .catch((err)=>{
        if(!paramObj.queryHandler)
          queryHandler.end()
        reject(err)
      })
    }

  })

}

function filterOutTablesNotForApp(unfilteredRows){
  var filteredRows = []
  forEach(unfilteredRows,function(row){
    if(row.Database == config.database.database){
      filteredRows.push(row)
    }
  })
  return filteredRows
}
