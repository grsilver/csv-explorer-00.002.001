import {findElementOrLoadInclude as findElementOrLoadInclude} from '../lib/findElementOrLoadInclude.js';
import {panelManager as panelManager} from '../panels/panelManager.js';
import {apiCallHandler as apiCallHandler} from '../api/apiCallHandler.js';


/* box oAuth info
https://conviva.app.box.com/developers/console/app/536698/configuration

*/

var m = {}
export {m as boxManager};
m.init = init

var _pnl
var _iframe
var _textBtn
var _oAuthCode
var _tokenInfo


function init(){

  console.log("boxManager: init")
  return new Promise(function(resolve,reject){
    findElementOrLoadInclude("#box_panel","/includes/box_panel.html")
      .then(function(ele){
        try{
          onMarkup(ele)
        }
        catch(err){
          reject(err)
        }
        resolve()
      })
      .catch(reject)
  })

}

function onMarkup(ele){
  //console.log("boxManager: got markup")
  _pnl = ele
  panelManager.registerPanel("Box Integration",_pnl)
  _iframe = ele.querySelector("iframe");
  _iframe.remove()
  _textBtn = ele.querySelector("#btnLogin");
  _textBtn.addEventListener("click",login)
}

function login(){
  _textBtn.remove()
  var username = "gsilvestri@conviva.com" // TEMP
  apiCallHandler.call("box.getOAuthUrl",{username:username})
  .then(function(oAuthUrl){
    return getOAuthCode(oAuthUrl)
  })
  .then(function(authCode){
    //console.log("boxManager: have authCode!, requesting token from API")
    return apiCallHandler.call("box.getToken",{authCode:authCode})
  })
  .then(function(tokenInfo){
    //console.log("boxManager: have tokenInfo!")
    _tokenInfo = tokenInfo
    // tokenInfo: {
    //  accessToken: 'ACCESS_TOKEN',
    //  refreshToken: 'REFRESH_TOKEN',
    //  acquiredAtMS: 1464129218402,
    //  accessTokenTTLMS: 3600000,
    // }
    _pnl.querySelector("*[data=token_info]").innerHTML= JSON.stringify(tokenInfo);
    return apiCallHandler.call("box.checkToken",{accessToken:tokenInfo.accessToken})
  })
  .then(function(response){
    //console.log("boxManager: done with login!")
    _pnl.querySelector("*[data=check_token]").innerHTML= JSON.stringify(response);
  })
  .catch(function(err){
    throw err
  })
}


function getOAuthCode(oAuthUrl){
  return new Promise(function(resolve,reject){
    //console.log("boxManager: getOAuthCode: calling URL:  "+ oAuthUrl)
    _pnl.appendChild(_iframe)
    _iframe.src = oAuthUrl
    var intervalID = setInterval (onInterval,1000)

    function onInterval(){
      var callbackURL
      try{
        callbackURL = _iframe.contentWindow.location.href
      }
      catch(err){
        // cross domain prohibits, wait for next interval
      }

      if(!callbackURL){
        return;
      }
      clearInterval(intervalID)
      //console.log("boxManager: callbackURL"+ callbackURL);
      //http://127.0.0.1:8082/?from_box=1&state=&code=nQm9JUKKobtW928QySpyi1rxfttFIChE
      var key = "code="
      var iKey = callbackURL.indexOf(key)
      var iStart = iKey + key.length
      _oAuthCode = callbackURL.substring(iStart)
      _pnl.querySelector("*[data=oAuthCode]").innerHTML= _oAuthCode
      _iframe.remove()
      resolve(_oAuthCode)
    }


  })
}
