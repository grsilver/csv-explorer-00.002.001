const http = require('http');
const port = process.argv[2] || 9000;
const fileManager = require('./fileManager.js')
const apiManager = require('../api/apiManager.js')
const isApiRequest = require('../api/isApiRequest.js')
isApiRequest
var exports = module.exports = {};
exports.listen = listen;



function listen(){
  http.createServer(onHttpRequest).listen(parseInt(port));
  console.log(`Server listening on port ${port}`);
}

function onHttpRequest (req, res) {
  console.log(`${req.method} ${req.url}`);

  if( isApiRequest(req)){
    apiManager.handleHttpRequest(req, res)
  }
  else{
    fileManager.handleHttpRequest(req, res)
  }

}
