
const methodRegistrationHandler = require("../configHandlers/methodRegistrationHandler.js");
module.exports = about;

function about(apiRequestHandler){
  apiRequestHandler.respondSuccess({
    version : methodRegistrationHandler.version(),
    methodParam: apiRequestHandler.getMethodParamObj()
  })
}
