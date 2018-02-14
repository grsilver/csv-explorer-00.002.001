//server\api\apiManager.js
const ApiResponseHandler = require('./ApiResponseHandler.js')
var exports = module.exports = {};
exports.handleHttpRequest = handleHttpRequest;



function handleHttpRequest(req, res){
  var responseHandler = new ApiResponseHandler(req, res)
  var requirePath = "../apiMethods"
  responseHandler.forEachMethodPathItem(function(item,count,isMethod){
    requirePath += "/" + item
    if(isMethod){
      callApiMethod(requirePath,responseHandler)
    }
  })
}
function callApiMethod(requirePath,responseHandler){
  requirePath+=".js"
  var m = require(requirePath )
  m.parseRequest(responseHandler)
  return
  try{
    var m = require(requirePath+ ".js")
    m.parseRequest(responseHandler)
  }
  catch(err){
    var msg = "unknown"
    if(typeof(err == "string")){
      msg = err
    }
    else if (err && err.message){
      msg = err.message
    }
    responseHandler.respondError({type:"parsePath", message:msg})
  }
}
