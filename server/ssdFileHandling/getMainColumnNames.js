const readCsvFileLine = require("./readCsvFileLine.js")
const forEach = require ('../lib/forEach.js');
module.exports = getMainColumnNames;

function getMainColumnNames(paramObj1){

  var paramObj2 = {}
  paramObj2.limit = 1
  paramObj2.filePath = paramObj1.filePath
  paramObj2.resolveLines = true


  return new Promise(function(resolve,reject){
    readCsvFileLine(paramObj2)
      .then(function(returnObj){

          try{
            var rows = parseLine(returnObj.lines)
            resolve(rows)
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

function parseLine(linesFromReadLine){
  var firstLine = linesFromReadLine[0];
  var aryColNames = firstLine.split(",");
  var aryReturn = []
  forEach(aryColNames,function(ssd_col_name){
    var planned_db_field_name = getDbProperName(ssd_col_name)
    var planned_db_type = getDbPlanned_db_type(planned_db_field_name)
    aryReturn.push({
      ssd_col_name:ssd_col_name
      ,planned_db_field_name:planned_db_field_name
      ,planned_db_type:planned_db_type
    })
  })
  return aryReturn
}

function getDbProperName(ssd_col_name){
  var planned_db_field_name = ssd_col_name.replace(/\s+/g, '_');
  planned_db_field_name = planned_db_field_name.replace(/\//g, '_');
  planned_db_field_name = planned_db_field_name.replace(/[{()}]/g, '_');
  planned_db_field_name = planned_db_field_name.replace(/__/g, '_');
  planned_db_field_name = planned_db_field_name.replace(/^_/, '') // remove _   ^ means beginning
  planned_db_field_name = planned_db_field_name.replace(/_$/, '') // remove _   $ means end
  return planned_db_field_name;
}
function getDbPlanned_db_type(planned_db_type){
  //https://stackoverflow.com/questions/219569/best-database-field-type-for-a-url
  /* http://dev.mysql.com/doc/refman/5.0/en/char.html
  Values in VARCHAR columns are variable-length strings.
  The length can be specified as a value from 0 to 255 before MySQL 5.0.3,
  and 0 to 65,535 in 5.0.3 and later versions.
  The effective maximum length of a VARCHAR in MySQL 5.0.3 and later is subject to the maximum row size
   (65,535 bytes, which is shared among all columns) and the character set used.

  */
  var type = "VARCHAR(20)"
  if(planned_db_type.indexOf("time") > 0){
    return  "int(8)"
  }
  if(planned_db_type.indexOf("url") > 0){
    return  "VARCHAR(2083)"
  }
  if(planned_db_type.indexOf("tags") > 0){
    return  "VARCHAR(2083)"
  }


  return type;
}
