
const readCsvFileLine = require("./readCsvFileLine.js")
var m = module.exports = {};
m.getLineCount = getLineCount



// API Method
function getLineCount(paramObj,resolve,reject){
  readCsvFileLine(paramObj)
    .then(function(returnObj){
      resolve(returnObj)
    })
    .catch(function(err){
      reject(err)
    })
}
