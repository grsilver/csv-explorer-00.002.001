const forEach = require ('../lib/forEach.js');
const config = require('../../ssd-explorer.config.js');
const getQueryHandler =  require('./getQueryHandler.js');

module.exports = cr8Table;

function cr8Table(paramObj){
  //paramObj.tblName;
  //paramObj.aryFieldInfo [{name:str,fieldType:str}];
  //paramObj.primaryKey;
  //paramObj.queryHandler
  //paramObj.ignoreIfExists

  /*
  for non compressed msecsElasped: 203607 (3.39345 minutes): Size: 1137.67 MB 1,703,913 rows
  for compressed 285317 (4.75 minutes): Size: 500.9 MiB	1,845,225


  */

  return new Promise(function(resolve,reject){

    if(paramObj.queryHandler){
      callSql(paramObj.queryHandler)
    }
    else {
      getQueryHandler().then(callSql).catch(reject)
    }

    function callSql(queryHandler){
      var sql = ""
      //sql += "SET GLOBAL innodb_file_per_table=1;\n"
      //sql += "SET GLOBAL innodb_file_format=Barracuda;\n"
      sql += "CREATE TABLE"
      if(paramObj.ignoreIfExists){
        sql += " IF NOT EXISTS"
      }
      sql += " " + paramObj.tblName + "\n(\n"

      forEach(paramObj.aryFieldInfo,function(fieldInfo,count){
        //(name VARCHAR(20), owner VARCHAR(20)
        if(count >0)
          sql+= ",\n"
        sql+= fieldInfo.name + " " + fieldInfo.fieldType
        if(paramObj.primaryKey && fieldInfo.name==paramObj.primaryKey){
          sql+= " NOT NULL PRIMARY KEY"
        }
        else{
          sql+= " DEFAULT NULL"
        }
      })
      sql +="\n)"
      sql += "\nENGINE=InnoDB DEFAULT CHARSET=latin1";
      //sql += " ROW_FORMAT=COMPRESSED";
      sql += ";";

      //ALTER TABLE ssd2018_02_22_001 ROW_FORMAT=COMPRESSED;


      queryHandler(sql).then(function(result){
        if(!paramObj.queryHandler)
          queryHandler.end()
        resolve(result)
      })
      .catch(function(err){
        if(!paramObj.queryHandler)
          queryHandler.end()
        reject(err)
      })
    }

  })
}
