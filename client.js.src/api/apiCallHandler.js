import {log as log} from '../helpers/log.js';
var m = {};
export {m as apiCallHandler};
m.call = call;
var sessionToken = "dsafkjhdk;afjhd;akfjhew" // todo

function call(methodPath,methodParam,callback){ //
  if (typeof methodParam == 'object') methodParam = JSON.stringify(methodParam)

  var data = {
    version:"ver.00.00.001",
    methodPath: methodPath,
    methodParam:methodParam,
    sessionToken:sessionToken
  }
  post("/api",data,callback)
}
function post(url,data,callback){
  data = data || {}
  var strEncodedData = encodeData(data)
  log(`sending: ${url} : \ndata: ${JSON.stringify(data)} \n encoded:${strEncodedData} `)

  var req = new XMLHttpRequest();
  req.open('POST', url);
  req.onreadystatechange = function() {
      if (req.readyState>3 && req.status==200){
        try{
          var objResp = JSON.parse(req.responseText)
          if(!objResp || !objResp.success){
            callback(false, {message:"API Communication Successful But API Error",innerError:objResp})
          }
          callback(true, objResp)
        }catch(e){
          callback(false, {message:"response has bad JSON",responseText:req.responseText})
        }
      }
      if (req.readyState>3 && req.status!=200){
        callback(false, {message:"req.status!=200"})
      }
  };
  req.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
  req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  req.send(strEncodedData);
  return req;
}
function encodeData(data){
  return typeof data == 'string' ? data : Object.keys(data).map(
            function(k){ return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) }
  ).join('&');
}
