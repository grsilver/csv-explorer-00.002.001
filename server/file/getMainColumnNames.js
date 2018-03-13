const readLineByLine = require("./readLineByLine.js")
const ssd_file_utils = require("./ssd_file_utils.js")
const forEach = require ('../lib/forEach.js');

module.exports = getMainColumnNames;

//TODO: turn into streaming. Won't work on large files

function getMainColumnNames(paramObj,resolve,reject){
  return new Promise(function(resolve,reject){
    paramObj.filePath = ssd_file_utils.normalizeFilePath(paramObj.filePath)
    paramObj.resolveLines = true
    paramObj.endLineNum = 0

    readLineByLine(paramObj)
    .then(function(returnObj){
      try{
        var rows = ssd_file_utils.parseHeaderLine(returnObj.lines[0])
      }
      catch(err){
        return reject(err)
      }
      resolve(rows)
    })
    .catch(reject)
  })

}
