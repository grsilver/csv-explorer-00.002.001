
const methodRegistrationHandler = require("../configHandlers/methodRegistrationHandler.js");
module.exports = about;

function about(paramObj){
  return new Promise(function(resolve,reject){
    try{
      resolve({
        version : methodRegistrationHandler.version(),
        description:"ssd-explorer"
        paramObj: paramObj
      })
    }
    catch(err){
      reject(err)
    }
  })
}
