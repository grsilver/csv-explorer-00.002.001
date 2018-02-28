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
      var rows = fieldNameUtils.parseHeaderLine(returnObj.lines[0])
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
