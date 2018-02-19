
const configHandler = require("../configHandler.js");
module.exports = listMethods;

var aryKeysFilterOut = ["filePath","methodName"]

function listMethods(apiRequestHandler){
  apiRequestHandler.respondSuccess({
    version : configHandler.version(),
    methods: getRegisteredMethods()
  })
}
function getRegisteredMethods(){
  var regAryExport = []
  configHandler.forEachMethodRegistration(function(reg,i){
    var regExport = {}
    for(var key in reg){
      if(!filterOutKey(key)){
        regExport[key] = reg[key]
      }
    }
    regAryExport.push(regExport)
  });
  return regAryExport;
}

function filterOutKey(key){
  for(var i=0;i<aryKeysFilterOut.length;i++){
    if(key == aryKeysFilterOut[i])
      return true
  }
  return false
}
