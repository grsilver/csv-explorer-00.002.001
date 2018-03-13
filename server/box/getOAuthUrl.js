const config = require('../../ssd-explorer.config.js');


var jobManager = {}
module.exports = getOAuthUrl;



function getOAuthUrl(paramObj){
  return new Promise((resolve,reject)=>{
    //https://developer.box.com/docs/oauth-20
    // https://account.box.com/api/oauth2/authorize?response_type=code&client_id=bl6m53o5y9yjb96i0eo9u614c6b98utq&state=security_token%3DKnhMJatFipTAnM0nHlZA&redirect_uri=http://127.0.0.1?box=true
    var url = 'https://account.box.com/api/oauth2/authorize?response_type=code&client_id='+config.box.clientID;
    url += "&state=security_token%" + Math.floor((Math.random() * 10000) + 1);
    // redirects to : https://127.0.0.1/?from_box=1&state=security_token%3DKnhMJatFipTAnM0nHlZA&code=0Ec0RpJTouP4gaFWZs5oCzFv7OY8YutS
    if(paramObj.username)
      url += "&box_login="+paramObj.username

    resolve(url)
  })

}
