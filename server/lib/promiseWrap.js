module.exports = promiseWrap;

function promiseWrap(method,paramObj){
  return new Promise(function(resolve,reject){
    try{
      method(paramObj,resolve,reject)
    }
    catch(err){
      reject(err)
    }
  })
}
