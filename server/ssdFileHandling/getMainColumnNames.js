const readCsvFileLine = require("./readCsvFileLine.js")
const forEach = require ('../lib/forEach.js');
const fieldNameUtils = require ('./fieldNameUtils.js');

module.exports = getMainColumnNames;



function getMainColumnNames(paramObj,resolve,reject){
  paramObj.limit = 1
  //paramObj.filePath = paramObj.filePath
  paramObj.resolveLines = true
  readCsvFileLine(paramObj)
  .then(function(returnObj){
    try{
      var rows = parseLine(returnObj.lines)
    }
    catch(err){
      return reject(err)
    }
    resolve(rows)
  })
  .catch(function(err){
    reject(err)
  })
}

function parseLine(linesFromReadLine){
  var firstLine = linesFromReadLine[0];
  var aryColNames = firstLine.split(",");
  var aryReturn = []
  forEach(aryColNames,function(csv_col_name){
    var db_friendly_field_name = fieldNameUtils.convertToProperDBFieldName(csv_col_name)
    var proposedFieldType = fieldNameUtils.proposeDbFieldTypeByName(db_friendly_field_name)
    aryReturn.push({
      csv_col_name:csv_col_name
      ,db_friendly_field_name:db_friendly_field_name
      ,proposedFieldType:proposedFieldType
    })
  })
  return aryReturn
}
