const config = require('../../ssd-explorer.config.js');
const methodRegistrationHandler = require("../configHandlers/methodRegistrationHandler.js");
module.exports = listMethods;

var aryKeysFilterOut = ["filePath","methodName"]

function listMethods(paramObj){
  return new Promise((resolve,reject)=>{
    var ary = getRegisteredMethods();
    resolve(ary)
  })
}
function getRegisteredMethods(){
  var regAryExport = []
  methodRegistrationHandler.forEachMethodRegistration(function(reg,i){
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
