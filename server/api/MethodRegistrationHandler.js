
module.exports = MethodRegistrationHandler
const apiMethodModuleRoot = "../apiMethods"



function MethodRegistrationHandler(registration){
  /*registration
  {
    requestPath : "importSSD.importFile"
    ,filePath:"importSSD/main.js"
    ,methodName:"apiImportFile"
    ,description:"description1 description1"
    ,access : ["tier2"]
    ,params : [
      {name:"param1",defaultValue:"default1"}
      ,{name:"param2",defaultValue:"default2"}
    ]
    ,return:"STRING"
  }
  */
  var t = this;
  t.registration = registration
  t.relativeFilePath = relativeFilePath
  t.requestPath = requestPath
  t.getMethod = getMethod

  function requestPath(){
    return registration.requestPath
  }
  function relativeFilePath(){
    return apiMethodModuleRoot + "/" + registration.filePath
  }
  function getMethod(apiResponseHandler){

    return new Promise(function(resolve,reject){
      if(t.method){
        resolve(t.method)
      }
      else{
        loadModule().then(function(mod){
            getModuleMethod(mod).then(function(method){
              resolve(method)
            }).catch(function(err){
              apiResponseHandler.errorGettingModuleMethod(err,t)
              reject(err)
            })
        }).catch(function(err){// loadModule
          apiResponseHandler.errorLoadingModule(err,t)
          reject(err)
        })
      }
    })
  }
  function loadModule(){
    return new Promise(function(resolve,reject){
      try{
        mod = require(relativeFilePath() )
        resolve(mod)
      }
      catch(err){
        reject(err)
      }
    })
  }
  function getModuleMethod(mod){
    return new Promise(function(resolve,reject){
      if(!registration.methodName){
        resolve(mod)
        return
      }
      else{
        if(mod[registration.methodName]){
          resolve(mod[registration.methodName])
        }
        else{
          reject({
            message :`require("${requirePath}") failed`+ err.message
          })
        }
      }
    })
  }


}
