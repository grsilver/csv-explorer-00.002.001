
const query = require("../../query/query.js");
var m = {}
module.exports = m;
m.apiQuery = apiQuery

function apiQuery(apiRequestHandler){
  var paramObj = apiRequestHandler.getMethodParamObj()
  console.log("apiQuery: paramObj: "+ paramObj)
  console.log("apiQuery: sql:"+ paramObj.sql)
  query.singleQueryPromise(paramObj.sql)
    .then(function(rows){
      apiRequestHandler.respondSuccess(rows)
    })
    .catch(function(err){
      apiRequestHandler.respondError(err)
    })
}
