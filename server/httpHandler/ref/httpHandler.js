
//https://stackoverflow.com/questions/16333790/node-js-quick-file-server-static-files-over-http
//https://nodejs.org/api/http.html
// should migrate to express.js
//https://stackoverflow.com/questions/11284634/upgrade-nodejs-to-the-latest-version-on-mac-os
// https://stackoverflow.com/questions/12006417/node-js-server-that-accepts-post-requests
const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const paramsParser = require('./paramsParser');
const port = process.argv[2] || 8081;
const httpDir = "../client/dist/"
//const httpDir = "../client/src/"
// maps file extention to MIME type
const map = {
  '.ico': 'image/x-icon',
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.wav': 'audio/wav',
  '.mp3': 'audio/mpeg',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
  '.doc': 'application/msword'
};
var serverHandler = {}
module.exports = serverHandler;
var apiHandler
serverHandler.addApiHandler= function (handler) {
   apiHandler = handler
   return serverHandler;
}
serverHandler.listen = function(){
  http.createServer(onRequest).listen(parseInt(port));

  console.log(`Server listening on port ${port}`);

  return serverHandler;
}
function onRequest(req, res){
  //console.log(`req.method: ${req.method}, req.url: ${req.url}`);

  // parse URL
  const parsedUrl = url.parse(req.url);
  // extract URL path
  let pathname = `.${parsedUrl.pathname}`;
  // based on the URL path, extract the file extention. e.g. .js, .doc, ...
  paramsParser.parse(req, function (params){
    if(pathname && pathname.indexOf("api")==2){
      serveAPI(req, res, params)
    }
    else{
      serveHTML(pathname, res, params)
    }
  })
}
function serveAPI(req, res, params){
  //res.setHeader('Content-type', 'application/json' );
  //request = https://nodejs.org/api/http.html
  var apiRequest = {
    clientRequest:req,
    params:params,
    respond: function(success,responseData){
      var responseWrapper = {success:success,apiResponse:responseData}
      res.end(JSON.stringify(responseWrapper));
    }
  }
  try{
    apiHandler.parseRequest(apiRequest)
  }
  catch(e){
    // handle errors better:
    // https://stackoverflow.com/questions/5999373/how-do-i-prevent-node-js-from-crashing-try-catch-doesnt-work
    var responseWrapper = {success:false,apiResponse:{type:"apiHandlerFatalError"}}
    res.end(JSON.stringify(responseWrapper));
  }

}
function serveHTML(pathname, res, params){
  var ext = path.parse(pathname).ext;
  //https://nodejs.org/api/path.html
  pathname = path.normalize(httpDir + pathname);
  //console.log(`loadHTML pathname1:${pathname}`);

  fs.exists(pathname, function (exist) {
    if(!exist) {
      // if the file is not found, return 404
      res.statusCode = 404;
      res.end(`File ${pathname} not found!`);
      return;
    }

    // if is a directory search for index file matching the extention
    if (fs.statSync(pathname).isDirectory()){
      pathname += '/index.html' //+ ext;
      ext = ".html";
    }

    // read file from file system
    fs.readFile(pathname, function(err, data){
      if(err){
        res.statusCode = 500;
        res.end(`Error getting the file: ${err}.`);
      } else {
        // if the file is found, set Content-type and send data
        res.setHeader('Content-type', map[ext] || 'text/plain' );
        res.end(data);
      }
    });
  });
}
