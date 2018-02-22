

const readCsvFileLine = require("./readCsvFileLine.js")
var m = module.exports = {};
m.getLineCount = getLineCount



// API Method
function getLineCount(apiRequestHandler){
  var paramObj = apiRequestHandler.getMethodParamObj()

  readCsvFileLine(paramObj)
    .then(function(returnObj){
      console.log("apiImportFile: then")
      apiRequestHandler.respondSuccess(returnObj)
    })
    .catch(function(err){
      console.log("apiImportFile: catch: "+err)
      apiRequestHandler.respondError(err)
    })
}
