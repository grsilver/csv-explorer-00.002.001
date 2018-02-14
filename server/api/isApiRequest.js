const url = require('url');
const apiKey = "api"

module.exports = isApiRequest;
function isApiRequest(req){
  const parsedUrl = url.parse(req.url);
  // extract URL path
  var strRequestedPath = `.${parsedUrl.pathname}`;

  if(strRequestedPath && strRequestedPath.indexOf(apiKey) > -1)
    return true

  return false
}
