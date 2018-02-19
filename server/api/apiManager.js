//server\api\apiManager.js
const ApiResponseHandler = require('./ApiResponseHandler.js')
const configHandler = require('../configHandler.js')
const apiMethodModuleRoot = "../apiMethods"
var exports = module.exports = {};
exports.handleHttpRequest = handleHttpRequest;

function handleHttpRequest(req, res){
  var responseHandler = new ApiResponseHandler(req, res);

  responseHandler.getRequestedMethodPath(function(requestedMethodPath){
    var apiMethodRegistration = getRegistrationFromRequestedMethodPath(requestedMethodPath)
    if(!apiMethodRegistration){
      return responseHandler.errorMethodNotRegistered()
    }
    responseHandler.apiMethodRegistration = apiMethodRegistration
    if(prepMethodRegistration(apiMethodRegistration,responseHandler))
      callMethod(apiMethodRegistration,responseHandler)
  });
}
function prepMethodRegistration(apiMethodRegistration,responseHandler){
  var apiMethodRegistration = responseHandler.apiMethodRegistration
  if(apiMethodRegistration.method){
    return true
  }
  var requirePath = apiMethodModuleRoot + "/" + apiMethodRegistration.filePath
  var mod
  try{
    mod = require(requirePath )
  }
  catch(err){
    responseHandler.errorLoadingMethod(err)
    return false
  }
  var method = mod
  if(apiMethodRegistration.methodName){
    method = mod[apiMethodRegistration.methodName]
  }
  if(!method){
    responseHandler.errorModuleLoadedButNoMethod()
    return false
  }
  else{
    apiMethodRegistration.method = method;
    return true;
  }
}
function callMethod(apiMethodRegistration,responseHandler){
  try{
      apiMethodRegistration.method(responseHandler)
  }
  catch(err){
    responseHandler.errorMethodCalled(err)
  }
}
function getRegistrationFromRequestedMethodPath(requestedMethodPath){
  var reg2
  configHandler.forEachMethodRegistration(function(reg,i){
    if(reg.requestPath == requestedMethodPath){
      reg2 = reg
      return true
    }
  })
  return reg2
}
