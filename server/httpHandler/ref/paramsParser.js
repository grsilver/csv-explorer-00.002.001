
var paramsParser = {}

module.exports = paramsParser;

paramsParser.parse = parse

function parse(req,callback){
  if (req.method == 'POST') {
        //console.log("POST" + new Date().toUTCString() );
        var strPostBody = '';
        req.on('data', function (data) {strPostBody += data;});
        req.on('end', function () { onPostEnd(strPostBody,callback)});
    }
    else
    {
        // todo, write code to get params from GET
        //console.log("GET");
        callback({})
    }
}
function onPostEnd(strPostBody,callback){
  strPostBody  = strPostBody || ""
  //console.log("parseParams_onPostEnd: body: " + strPostBody);
  var aryPostBody = strPostBody.split("&")
  var params = {}
  var i=0
  for( i=0; i<aryPostBody.length; i++){
    addKV(aryPostBody[i],params,i)
  }
  callback(params)
}
function addKV(strKV,params,i){
  var strKV,aryKV,k,v
  //console.log(`parseParams_onPostEnd [${i}]: strKV: ${strKV}`);
  aryKV = strKV.split("=");
  //console.log(`parseParams_onPostEnd [${i}]aryKV: `+ aryKV);
  k = aryKV[0];
  v = decodeURIComponent(aryKV[1]);
  //console.log(`parseParams_onPostEnd [${i}]: ${k}:${v}`);
  params[k] = v;
}
