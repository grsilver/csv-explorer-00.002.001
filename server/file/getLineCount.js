
const readLineByLine = require("./readLineByLine.js")
const ssd_file_utils = require("./ssd_file_utils.js")
var m = module.exports = getLineCount;


function getLineCount(paramObj){
  paramObj.filePath = ssd_file_utils.normalizeFilePath(paramObj.filePath)
  return readLineByLine(paramObj) // returns a promise
}
