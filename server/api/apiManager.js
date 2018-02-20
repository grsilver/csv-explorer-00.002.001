//server\api\apiManager.js
const methodRegistrationManager = require('./methodRegistrationManager.js')
const ApiResponseHandler = require('./ApiResponseHandler.js')

var m = module.exports = {};
m.handleHttpRequest = handleHttpRequest;

function handleHttpRequest(req, res){
  var responseHandler = new ApiResponseHandler(req, res);
  responseHandler.getRequestedMethodPath().then(function(requestedMethodPath){
      var apiRegHandler = methodRegistrationManager.getRegHandlerByPath(requestedMethodPath)

      if(!apiRegHandler){
        return responseHandler.errorMethodNotRegistered()
      }

      apiRegHandler.getMethod(responseHandler)
      .then(function(method){
        try{
          method(responseHandler)
        }
        catch(err){
          responseHandler.errorMethodCalled(err)
        }
      })
  }).catch(function(err){
      // responseHandler.getRequestedMethodPath
      throw err
  })


}
