
const configHandler = require("../configHandler.js");
module.exports = about;

function about(apiRequestHandler){
  apiRequestHandler.respondSuccess({
    version : configHandler.version(),
    methodParam: apiRequestHandler.getMethodParam()
  })
}
