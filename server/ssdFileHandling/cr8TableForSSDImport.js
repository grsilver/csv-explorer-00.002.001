// cr8TableForSSDImport
const forEach = require ('../lib/forEach.js');
const config = require('../../ssd-explorer.config.js');
const getMainColumnNames = require('./getMainColumnNames.js');
//const knex =  require('knex');
//const mariasql =  require('mariasql');
const query =  require('../query/query.js');
const listSizesOfTables =  require('../query/listSizesOfTables.js');
const promiseWrap = require('../lib/promiseWrap.js')

module.exports = cr8TableForSSDImport;

function cr8TableForSSDImport(paramObj,resolve,reject){
  //paramObj.tblName
  //paramObj.filePath
  var tblName = paramObj.tblName
  var filePath = paramObj.filePath

  promiseWrap(listSizesOfTables,paramObj)
  .then(function(aryTables){
    if(tblExisits(tblName,aryTables)){
      return reject({type:"TableExists",message:`a table with the name ${tblName} already exists.`} )
    }

    promiseWrap(getMainColumnNames,paramObj)
    .then(function(columnNames){
      var sql2cr8 = cr8Sql2Cr8Tble(tblName,columnNames)
      query.singleQueryPromise(sql2cr8)
          .then(function(rows){
            var sql2forTbleInfo = cr8SqlForTableInfo(tblName)
            query.singleQueryPromise(sql2forTbleInfo)
                .then(function(rows){
                  resolve(rows)
                })
                .catch(function(err){
                  reject(err)
                })
          })
          .catch(function(err){
            reject(err)
          })
    })
    .catch(function(err){
      reject(err)
    })

  })
  .catch(function(err){
    reject(err);
  })

}

function tblExisits(tblName,aryTables){
  return forEach(aryTables,function(obj,count,fnBreak){
    if(obj.Table == tblName)
      return fnBreak(true)
  })
}

function cr8Sql2Cr8Tble(tblName,columnNames){
  var sql = `CREATE TABLE ${tblName}
  (`
    forEach(columnNames,function(columnNameObj,count){
      var field_name =  columnNameObj.db_friendly_field_name
      var db_type = columnNameObj.proposedFieldType
      //(name VARCHAR(20), owner VARCHAR(20)
      if(count >0)
        sql+= ","
      sql+= field_name + " " + db_type
    })

  sql+=`
  )`;
  return sql;
}

function cr8SqlForTableInfo(tblName){
  var sql = `SELECT COLUMN_NAME
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA ='${config.database.database}'
  AND TABLE_NAME='${tblName}';`
  return sql
}


/*
function useKnex(){
  knex({
    client: 'mysql',
    connection: {
      host : config.database.host,
      user : config.database.user,
      //password : 'your_database_password',
      database : config.database.database
    }
  });
  //http://knexjs.org/#Schema-Building
  return knex.schema.createTable('users', function (table) {
    table.string('conviva_session_id');
    foreach(fieldObjArray,function(fieldObj){
      var field_name = fieldObj.planned_db_field_name
      var db_type = fieldObj.planned_db_type
      if(field_name=="conviva_session_id")
        return
      if(db_type."int(8)"){
        table.integer(field_name)
      }
    })
    callback(true)
  })
}
*/
