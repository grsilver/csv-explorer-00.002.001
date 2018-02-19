//https://conviva.app.box.com/developers/console/app/536698/configuration
import {apiHandler as apiHandler} from './apiHandler.js';


var m = {};
export {m as boxHandler};


m.init = init;

var authCode

//https://github.com/github/fetch
var btn_template
function init(){
  // if called from box:
  // https://127.0.0.1/?from_box=1&state=security_tokens90&code=Y1Le0FPRwZHYfhRP8kTflVYGLtqiXv6G
  console.log('boxHandler.init()');
  checkForBoxUserToken()
  onWindowLoad(function(){
    document.getElementById("btn_boxLogon").addEventListener("click", boxLogon);
  })
}



function checkForBoxUserToken(){
  //https://127.0.0.1/?from_box=1&state=security_tokens90&code=Y1Le0FPRwZHYfhRP8kTflVYGLtqiXv6G
  var uri = document.location.toString();
  var params = {}
  uri.replace(
    new RegExp("([^?=&]+)(=([^&]*))?", "g"),
    function($0, $1, $2, $3) { params[$1] = $3; }
  );
  authCode = params.code
}

function boxLogon(){
  if(!authCode){
    getBox_OAuth_URL();
    return
  }

  folderListing()

}

function folderListing(){
  var folderID = ""
  call("folderListing",{folderID:folderID},function(success, apiResponse){
    if( success ){
      onFolderListing(apiResponse)
    }
    else{
      console.log("folderListing error: "+ JSON.stringify(objResp))
    }
  })
}

function onFolderListing(apiResponse){
  debugger
}

function getBox_OAuth_URL(){
  var username = null;
  call("OAuthUrl",{username:username},function(success, apiResponse){
    if( success ){
      on_box_OAuth_URL(apiResponse.url)
    }
    else{
      console.log("getBox_OAuth_URL error: "+ JSON.stringify(objResp))
    }
  })
}

function on_box_OAuth_URL(url){
  debugger
  document.location = url
}

function call(method,params,callback){
  params = params || {}
  params.authCode = authCode
  params.method = method
  apiHandler.call('box',params,function(success, objResp){
    if( success ){
      callback(true,objResp.apiResponse)
    }
    else{
      callback(false,objResp)
    }
  })
}

function onWindowLoad(f){
  document.addEventListener("DOMContentLoaded", function(event) {
    f();
  });
}
