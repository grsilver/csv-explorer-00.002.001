//server\api\ApiResponseHandler.js
/* how to delete require cachse https://stackoverflow.com/questions/9210542/node-js-require-cache-possible-to-invalidate

*/
//A shortcut for fold all is Ctrl+Alt+Shift+[.
var qs = require('querystring');
var _ = require('lodash');
const serializeErrorLib = require('serialize-error');
const url = require('url');

module.exports = ApiResponseHandler;



function ApiResponseHandler(request, response){
  //var obj = JSON.parse(str);
  var t = this;
  t.respondSuccess = respondSuccess;
  t.respondError = respondError;
  t.getMethodParamObj = getMethodParamObj
  t.getRequestedMethodPath  = getRequestedMethodPath
  t.errorMethodNotRegistered  = errorMethodNotRegistered
  t.errorLoadingModule  = errorLoadingModule
  t.errorGettingModuleMethod  = errorGettingModuleMethod
  t.errorMethodCalled  = errorMethodCalled
  t.apiMethodRegistration = null
  var apiMetaParams;
  /* apiMetaParams :{
    methodPath : "a.b.c",
    methodParam : obj,
    version: "",
    sessionToken:"";
  }*/
  function respondSuccess(resp,objMetaResponse){
    response.writeHead(200, {"Content-Type": "application/json"});
    responseContainer = {
      success:true
      ,response:resp
    }
    if(typeof (objMetaResponse) === "object"){
      _.forEach(objMetaResponse,function(v,n){
        responseContainer[n]=v
      })
    }
    var json = JSON.stringify(responseContainer);
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

  function errorMethodCalled(err){
    respondError({
      type:"methodCalledError"
      ,message:"The API was Called But There was an error "
    }
    ,err)
  }
  function errorLoadingModule(err,methodRegistrationHandler){
    respondError({
      type:"errorLoadingModule"
      ,message:"The requested module could not be loaded"
      ,methodPath : apiMetaParams.methodPath
      ,filePath: methodRegistrationHandler.relativeFilePath()
    }
    ,err)
  }
  function errorGettingApiMetaParams(err){
    respondError({
      type:"errorGettingApiMetaParams"
      ,message:"the api call had insufficent ApiMetaParams"
      ,apiMetaParamsTemplate :{
          methodPath : "a.b.c where c(methodParam)",
          methodParam : "OBJECT",
          version: "STRING",
          sessionToken:"STRING"
      }
    }
    ,err)
  }
  function errorGettingModuleMethod(err,methodRegistrationHandler){
    respondError({
      type:"errorGettingModuleMethod"
      ,message:"The module loaded but no method: "+ apiMetaParams.methodPath
      ,methodPath : apiMetaParams.methodPath
      ,filePath: methodRegistrationHandler.relativeFilePath()
      ,methodName : methodRegistrationHandler.registration.methodName
    }
    ,err)
  }
  function errorMethodNotRegistered(err){
    respondError({
      type:"errorMethodNotRegistered"
      ,message:"The requested method is not registered: "+ apiMetaParams.methodPath
    }
    ,err)
  }

  function getMethodParamObj(){
    return apiMetaParams.methodParam
  }
  function getRequestedMethodPath(){
    return new Promise(function(resolve,reject){

      try{
        getApiMetaParams(function(apiMetaParams){
          var err
          if(!apiMetaParams){
            err = {message:"no api meta params"}
          }
          else if(!apiMetaParams.methodPath){
            err = {message:"no apiMetaParams.methodPath"}
          }

          if(err){
            errorGettingApiMetaParams(err)
            reject(err)
            return
          }
          resolve(apiMetaParams.methodPath)
        })
      }
      catch(e){
        errorGettingApiMetaParams(e)
        reject(e)
      }

    })
  }
  function getApiMetaParams (callback) {
      if(apiMetaParams){
        if(callback)callback(apiMetaParams)
        return apiMetaParams
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
        if (body.length > 1e6){
          throw new Error("POST: Too much POST data, kill the connection! 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB")
          request.connection.destroy();
        }

    });

    request.on('end', function () {
        //var objPost = qs.parse(body);
        // Note: The object returned by the querystring.parse() method does not prototypically inherit from the JavaScript Object. This means that typical Object methods such as obj.toString(), obj.hasOwnProperty(), and others are not defined and will not work.
        //https://nodejs.org/api/querystring.html#querystring_querystring_parse_str_sep_eq_options()
        callback(parseApiMetaParams(body))
    });
  }
  function getGet(callback){
    //request.var url = require('url');
    var url_parts = url.parse(request.url, true);
    var query = url_parts.query;
    //var objGet = qs.parse(query);
    callback(parseApiMetaParams(query))
  }
  function parseApiMetaParams(strQuery){
    //data={}
    //console.log("parseApiMetaParams: strQuery: "+ strQuery)
    var strJson = (function(){
      var key = "data="
      var iStart = key.length
      return strQuery.substring(iStart)
    })()
    var paramsObj = JSON.parse(strJson)

    apiMetaParams = paramsObj
    if(typeof(paramsObj.methodParam) ==="string"){
        paramsObj.methodParam = JSON.parse(paramsObj.methodParam)
    }
    return paramsObj
  }

}

function serializeError(err){
   return serializeErrorLib(err)
}
