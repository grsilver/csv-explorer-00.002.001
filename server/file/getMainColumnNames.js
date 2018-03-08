const readLineByLine = require("./readLineByLine.js")
const ssdFileHandling_common = require("./ssdFileHandling_common.js")
const forEach = require ('../lib/forEach.js');

module.exports = getMainColumnNames;


function getMainColumnNames(paramObj,resolve,reject){

  paramObj.filePath = ssdFileHandling_common.normalizeFilePath(paramObj.filePath)
  paramObj.resolveLines = true
  paramObj.endLineNum = 0

  readLineByLine(paramObj)
  .then(function(returnObj){
    try{
      var rows = ssdFileHandling_common.parseHeaderLine(returnObj.lines[0])
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
