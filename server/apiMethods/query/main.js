const config = require('../../../ssd-explorer.config.js');
const queryPRIV = require("../../query/query.js");
const getDataBaseSizePRIV = require("../../query/getDataBaseSize.js");

var m = {}
module.exports = m;
m.query = query
m.getDataBaseSize = getDataBaseSize

function query(apiRequestHandler){
  var paramObj = apiRequestHandler.getMethodParamObj()
  //console.log("apiQuery: paramObj: "+ paramObj)
  //console.log("apiQuery: sql:"+ paramObj.sql)
  queryPRIV.singleQueryPromise(paramObj.sql)
    .then(function(rows){
      apiRequestHandler.respondSuccess(rows)
    })
    .catch(function(err){
      apiRequestHandler.respondError(err)
    })
}

function getDataBaseSize(apiRequestHandler){
  getDataBaseSizePRIV()
    .then(function(rows){
      apiRequestHandler.respondSuccess(rows)
    })
    .catch(function(err){
      apiRequestHandler.respondError(err)
    })
}
