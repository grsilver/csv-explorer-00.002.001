
var m = module.exports = {};

m.parseRequest = parseRequest

function parseRequest(apiRequestHandler){
  apiRequestHandler.respondSuccess({
    version : "ddddddddd",
    methodParam: apiRequestHandler.getMethodParam()
  })
}
