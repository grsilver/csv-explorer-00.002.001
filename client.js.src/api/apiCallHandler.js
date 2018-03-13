import {log as log} from '../lib/log.js';
var m = {};
export {m as apiCallHandler};
m.call = call;
var sessionToken = "dsafkjhdk;afjhd;akfjhew" // todo

function call(methodPath,methodParam,callback){
  if (typeof methodParam == 'object') methodParam = JSON.stringify(methodParam)
  var data = {
    version:"ver.00.00.001",
    methodPath: methodPath,
    methodParam:methodParam,
    sessionToken:sessionToken
  }
  var url = "/api"
  //var strData = encodeData(data)
  var strData = "data="+JSON.stringify(data)
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.onload = function () {
      if (this.status >= 200 && this.status < 300) {
        try{
          var objResp = JSON.parse(xhr.responseText)
          if(!objResp || !objResp.success){
            reject({message:"API Communication Successful But API Error. objResp.success is false.",innerError:objResp})
          }
          resolve(objResp.response)
        }catch(e){
          reject({message:"response has bad JSON",responseText:xhr.responseText})
        }
      } else {
        reject({
          messsage:"!(this.status >= 200 && this.status < 300)",
          status: this.status,
          statusText: xhr.statusText
        });
      }
    };
    xhr.onerror = function () {
      reject({
        status: this.status,
        statusText: xhr.statusText
      });
    };
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(strData);
  });
}
function encodeData(data){
  return typeof data == 'string' ? data : Object.keys(data).map(
            function(k){ return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) }
  ).join('&');
}
