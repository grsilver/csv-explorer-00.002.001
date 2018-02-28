
const forEach = require ('../lib/forEach.js');
const config = require('../../ssd-explorer.config.js');
const fieldNameUtils = require ('./fieldNameUtils.js');
const readCsvFileLine = require("./readCsvFileLine.js")
const promiseWrap = require('../lib/promiseWrap.js');
const mysql = require('mysql');
//const knex =  require('knex');
//const mariasql =  require('mariasql');

module.exports = importSSD;

/* insert multiple browser
https://stackoverflow.com/questions/6889065/inserting-multiple-rows-in-mysql
INSERT INTO tbl_name
    (a,b,c)
VALUES
    (1,2,3),
    (4,5,6),
    (7,8,9);
*/

function importSSD(paramObj,resolve,reject){
  //paramObj.tblName
  //paramObj.filePath
  var tblName = paramObj.tblName
  var filePath = paramObj.filePath
  var connection,sql, columuns
  var returnObj = {
    insertedCount:0
    ,attemptedCount:0
    ,error_or_intertedCount:0
    ,errorCount:0
  }


  paramObj.limit = 5
  //paramObj.resolveLines = true
  paramObj.onLine = onLine;

  connection = mysql.createConnection({
    host: config.database.host,
    user: config.database.user,
    //password: 'password',
    database: config.database.database
  });
  function endConnection(){
    if(connection)
      connection.end()
    connection = null;
  }

  readCsvFileLine(paramObj)
  .then(function(readLineInfo){
    returnObj.readLineInfo = readLineInfo
  })
  .catch(function(err){
    //console.log("ddddd")
    //throw err
    returnObj.error = err
    reject(returnObj)
  })

  function onQueryReturn(){
    returnObj.error_or_intertedCount++
    if(returnObj.error_or_intertedCount == returnObj.attemptedCount){
      resolve(returnObj)
    }
  }


  function onLine(line,lineCount,functionBreak,throwError){
    if(lineCount==1){
      return setColumuns(line)
    }

    var values = parseValuesLine(line)
    sql  = `INSERT INTO ${tblName} (${columuns}) VALUES(${values});`

    returnObj.attemptedCount++
    connection.query(sql, (err,rows) => {
      if(err){
        endConnection()
        returnObj.errorCount++
        returnObj.lastError = err
        functionBreak()
        onQueryReturn()
      }
      else{
        returnObj.insertedCount++
        //returnObj.rows.push(rows)
        //resolve(returnObj)
        onQueryReturn()
      }
    });

  }
  function parseValuesLine(line){
    line = line.replace(/'/g, "\\'");
    line = `'${line}'`
    line = line.replace(/,/g, "','");
    return line
  }
  function setColumuns(line){
    columuns = ""
    var ary = fieldNameUtils.parseHeaderLine(line)
    forEach(ary,function(obj,count){
      if(count > 0){
        columuns += ","
      }
      columuns += obj.db_friendly_field_name
    })
  }

}
