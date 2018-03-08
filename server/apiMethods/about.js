
const methodRegistrationHandler = require("../configHandlers/methodRegistrationHandler.js");
module.exports = about;

function about(paramObj){
  return new Promise((resolve,reject)=>{
    resolve({
      version : methodRegistrationHandler.version()
      ,description:"ssd-explorer"
      ,paramObj: paramObj
    })
  })
}
