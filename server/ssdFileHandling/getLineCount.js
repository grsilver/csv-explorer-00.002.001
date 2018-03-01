
const readLineByLine = require("./readLineByLine.js")
const ssdFileHandling_common = require("./ssdFileHandling_common.js")
var m = module.exports = getLineCount;


function getLineCount(paramObj,resolve,reject){
  paramObj.filePath = ssdFileHandling_common.normalizeFilePath(paramObj.filePath)
  readLineByLine(paramObj)
    .then(function(returnObj){
      resolve(returnObj)
    })
    .catch(function(err){
      reject(err)
    })
}
