const url = require('url');
const fs = require('fs');
const path = require('path');
const contentTypeMap = require('./contentTypeMap.js')
const config = require('../../ssd-explorer.config.js');
const dirRoot = "./client.dist"

var exports = module.exports = {};
exports.handleHttpRequest = handleHttpRequest;

function handleHttpRequest(req, res){
  const parsedUrl = url.parse(req.url);
  // extract URL path
  var strRequestedPath = `.${parsedUrl.pathname}`;

  checkIfPathExists(strRequestedPath, res,function(strRelativePath){
      strRelativePath = checkForDafaultFileName(strRelativePath)
      respondWithFile(strRelativePath,res)
  })
}

function checkIfPathExists(strRequestedPath, res,callback){
  //var strRelativePath = dirRoot + "/" + strRequestedPath;
  var strRelativePath = config.server.root + "/" + strRequestedPath;
  fs.exists(strRelativePath, function (boolExists) {
      //console.log(`loadRequestedPath: ${strRelativePath}. boolExists:${boolExists}`);
      if(!boolExists) {
        // if the file is not found, return 404
        res.statusCode = 404;
        res.end(`File ${strRequestedPath} not found!`);
        return;
      }
      callback(strRelativePath)
  })
}

function checkForDafaultFileName(path){
  //var ext = path.parse(path).ext || ".html"
  //if (fs.statSync(pathname).isDirectory()) pathname += '/index' + ext;
  if (fs.statSync(path).isDirectory())
    path += '/index.html'
  return path
}

function respondWithFile(strRelativePath,res){
  var ext = path.parse(strRelativePath).ext || ".html"
  fs.readFile(strRelativePath, function(err, data){
    if(err){
      res.statusCode = 500;
      res.end(`Error getting the file: ${err}.`);
    }
    else {
      // if the file is found, set Content-type and send data
      res.setHeader('Content-type', contentTypeMap[ext] || 'text/plain' );
      res.end(data);
    }
  });
}
