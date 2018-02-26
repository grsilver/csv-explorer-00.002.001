const config = require('../../../ssd-explorer.config.js');
const queryPRIV = require("../../query/query.js");
const getDataBaseSizePRIV = require("../../query/getDataBaseSize.js");

var m = {}
module.exports = m;
m.query = query
m.getDataBaseSize = getDataBaseSize


function query(paramObj){
  return new Promise(function(resolve,reject){
    queryPRIV.singleQueryPromise(paramObj.sql)
      .then(function(rows){
        resolve(rows)
      })
      .catch(function(err){
        reject(err)
      })
  })
}


function getDataBaseSize(paramObj){
  return new Promise(function(resolve,reject){
    getDataBaseSizePRIV(paramObj)
      .then(function(rows){
        resolve(rows)
      })
      .catch(function(err){
        reject(err)
      })
  })
}
