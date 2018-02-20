

const readCSV = require("./importSSD/readCSV.js")
var m = module.exports = {};
m.apiImportFile = apiImportFile



// API Method
function apiImportFile(apiRequestHandler){
  var paramObj = apiRequestHandler.getMethodParamObj()
  try{
    readCSV(paramObj,function(success,returnObj){
      apiRequestHandler.respondSuccess({
        successReadingFle : success,
        returnObj: returnObj,
        methodParam: paramObj
      })
    })
  }
  catch(e){
    apiRequestHandler.respondSuccess({
      successReadingFle : false,
      error: e.message,
      methodParam: paramObj
    })
  }
}
