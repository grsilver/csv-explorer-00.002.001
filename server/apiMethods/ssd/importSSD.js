

const readCSV = require("./importSSD/readCSV.js")
var m = module.exports = {};
m.parseRequest = parseRequest





function parseRequest(apiRequestHandler){
  var paramObj = apiRequestHandler.getMethodParam()
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
