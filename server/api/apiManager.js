//server\api\apiManager.js
const methodRegistrationManager = require('./methodRegistrationManager.js')
const ApiResponseHandler = require('./ApiResponseHandler.js')
const promiseWrap = require('../lib/promiseWrap.js')


var m = module.exports = {};
m.handleHttpRequest = handleHttpRequest;

function handleHttpRequest(req, res){
  var responseHandler = new ApiResponseHandler(req, res);
  responseHandler.getRequestedMethodPath()
  .then(function(requestedMethodPath){
      var apiRegHandler = methodRegistrationManager.getRegHandlerByPath(requestedMethodPath)

      if(!apiRegHandler){
        return responseHandler.errorMethodNotRegistered()
      }

      apiRegHandler.getMethod(responseHandler)
      .then(function(method){
        var paramObj = responseHandler.getMethodParamObj();
        try{
          method(paramObj)
          .then(responseHandler.respondSuccess)
          .catch(responseHandler.respondError)
        }
        catch(err){
          responseHandler.respondError(err)
        }
      })
      .catch(function(err){ // apiRegHandler.getMethod calls  reject
          responseHandler.respondError(err)
      })
  })
  .catch(function(err){ // responseHandler.getRequestedMethodPath calls  reject
      responseHandler.respondError(err)
      //throw err
  })


}
