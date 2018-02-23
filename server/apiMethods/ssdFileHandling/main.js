
const readCsvFileLine = require("../../ssdFileHandling/readCsvFileLine.js")
const getMainColumnNamesPRIV = require("../../ssdFileHandling/getMainColumnNames.js")
var m = module.exports = {};
m.getLineCount = getLineCount
m.getMainColumnNames = getMainColumnNames



// API Method
function getLineCount(apiRequestHandler){
  var paramObj = apiRequestHandler.getMethodParamObj()

  readCsvFileLine(paramObj)
    .then(function(returnObj){
      apiRequestHandler.respondSuccess(returnObj)
    })
    .catch(function(err){
      apiRequestHandler.respondError(err)
    })
}
function getMainColumnNames(apiRequestHandler){
  var paramObj = apiRequestHandler.getMethodParamObj()
  getMainColumnNamesPRIV(paramObj)
    .then(function(returnObj){
      apiRequestHandler.respondSuccess(returnObj)
    })
    .catch(function(err){
      apiRequestHandler.respondError(err)
    })
}
