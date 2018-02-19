//server\api\ApiResponseHandler.js
/* how to delete require cachse https://stackoverflow.com/questions/9210542/node-js-require-cache-possible-to-invalidate

*/

var qs = require('querystring');
const serializeErrorLib = require('serialize-error');
const url = require('url');

module.exports = ApiResponseHandler;


function ApiResponseHandler(request, response){
  //var obj = JSON.parse(str);
  var t = this;
  t.respondSuccess = respondSuccess;
  t.respondError = respondError;
  t.getMethodParam = getMethodParam
  t.getRequestedMethodPath  = getRequestedMethodPath
  t.errorMethodNotRegistered  = errorMethodNotRegistered
  t.errorLoadingMethod  = errorLoadingMethod
  t.errorModuleLoadedButNoMethod  = errorModuleLoadedButNoMethod
  t.errorMethodCalled  = errorMethodCalled
  t.apiMethodRegistration = null
  var params;
  /* params :{
    methodPath : "a.b.c",
    methodParam : obj,
    version: "",
    sessionToken:"";
  }*/
  function errorMethodCalled(err){
    respondError({
      type:"methodCalledError"
      ,message:"The API was Called But There was an error "
    }
    ,err)
  }
  function errorLoadingMethod(err){
    respondError({
      type:"errorLoadingMethod"
      ,message:"The requested method could not be loaded: "+ params.methodPath
    }
    ,err)
  }
  function errorModuleLoadedButNoMethod(err){
    respondError({
      type:"errorModuleLoadedButNoMethod"
      ,message:"The requested method could not be loaded: "+ params.methodPath
    }
    ,err)
  }
  function errorMethodNotRegistered(err){
    respondError({
      type:"errorMethodNotRegistered"
      ,message:"The requested method is not registered: "+ params.methodPath
    }
    ,err)
  }
  function getMethodParam(){
    return params.methodParam
  }
  function getRequestedMethodPath(fn){
    getParams(function(params){
      fn(params.methodPath)
    })
    if (params)
      return params.methodPath
  }
  function respondSuccess(obj){
    response.writeHead(200, {"Content-Type": "application/json"});
    var json = JSON.stringify({
      success: true,
      response:obj
    });
    response.end(json);
  }
  function respondError(obj,innerError){
    response.writeHead(200, {"Content-Type": "application/json"});
    var json = JSON.stringify({
      success: false,
      response:obj,
      innerError : serializeError(innerError)
    });
    response.end(json);
  }
  function getParams (callback) {
      if(params){
        if(callback)callback(params)
        return params
      }
      if (request.method == 'POST') {
          getPost(callback)
      }
      if (request.method == 'GET') {
          getGet(callback)
      }
  }
  function getPost(callback){
    var body = '';
    request.on('data', function (data) {
        body += data;

        // Too much POST data, kill the connection!
        // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
        if (body.length > 1e6)
            request.connection.destroy();
    });

    request.on('end', function () {
        var objPost = qs.parse(body);
        // Note: The object returned by the querystring.parse() method does not prototypically inherit from the JavaScript Object. This means that typical Object methods such as obj.toString(), obj.hasOwnProperty(), and others are not defined and will not work.
        //https://nodejs.org/api/querystring.html#querystring_querystring_parse_str_sep_eq_options()
        callback(parseParams(objPost))
    });
  }
  function getGet(callback){
    //request.var url = require('url');
    var url_parts = url.parse(request.url, true);
    var query = url_parts.query;
    var objGet = qs.parse(query);
    callback(parseParams(objGet))
  }
  function parseParams(obj){
    var json = JSON.stringify(obj)
    params = JSON.parse(json)

    return params
  }

}

function serializeError(err){
   return serializeErrorLib(err)
}
