const config = require('../../ssd-explorer.config.js');
var BoxSDK = require('box-node-sdk');

var jobManager = {}
module.exports = checkToken;



function checkToken(paramObj){
  return new Promise((resolve,reject)=>{

    //paramObj.accessToken, taken from: tokenInfo: {
    //  accessToken: 'ACCESS_TOKEN',
    //  refreshToken: 'REFRESH_TOKEN',
    //  acquiredAtMS: 1464129218402,
    //  accessTokenTTLMS: 3600000,
    // }
    var user_access_token = paramObj.accessToken

    var sdk = new BoxSDK({
      clientID: config.box.clientID,
      clientSecret: config.box.clientSecret
    });

    var client = sdk.getBasicClient(user_access_token); // USER_ACCESS_TOKEN... use my Developer Token
    client.users.get(client.CURRENT_USER_ID, null, function(err, currentUser) {
      if(err){
        var err2 = new Error("client.users.get error")
        err2.innerError = err
        reject(err2)
        throw err

      }
      resolve({
        boxCommSuccess:true
        ,message:"new BoxSDK().getBasicClient(user_access_token).users.get: " + currentUser.name
      })
    });



  })

}
