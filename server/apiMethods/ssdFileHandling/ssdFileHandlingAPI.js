
const readCsvFileLine = require("../../ssdFileHandling/readCsvFileLine.js")
const getMainColumnNamesPRIV = require("../../ssdFileHandling/getMainColumnNames.js")
const cr8TableForSSDImportPRIV = require("../../ssdFileHandling/cr8TableForSSDImport.js")
var m = module.exports = {};
m.getLineCount = getLineCount
m.getMainColumnNames = getMainColumnNames
m.cr8TableForSSDImport = cr8TableForSSDImport



// API Method
function getLineCount(paramObj){
  return new Promise(function(resolve,reject){
    readCsvFileLine(paramObj)
      .then(function(returnObj){
        resolve(returnObj)
      })
      .catch(function(err){
        reject(err)
      })
  })
}
function getMainColumnNames(paramObj){
  return new Promise(function(resolve,reject){
    getMainColumnNamesPRIV(paramObj)
      .then(function(returnObj){
        resolve(returnObj)
      })
      .catch(function(err){
        reject(err)
      })
  })
}
function cr8TableForSSDImport(paramObj){
  return new Promise(function(resolve,reject){
    cr8TableForSSDImportPRIV(paramObj)
      .then(function(returnObj){
        resolve(returnObj)
      })
      .catch(function(err){
        reject(err)
      })
  })
}
