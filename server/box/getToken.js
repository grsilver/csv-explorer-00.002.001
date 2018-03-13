const config = require('../../ssd-explorer.config.js');
var BoxSDK = require('box-node-sdk');

var jobManager = {}
module.exports = getToken;



function getToken(paramObj){
  return new Promise((resolve,reject)=>{

    var authCode = paramObj.authCode
    console.log("getToken.js: authCode:"+ authCode)


    var sdk = new BoxSDK({
      clientID: config.box.clientID,
      clientSecret: config.box.clientSecret
    });


    //console.log("getToken.js: calling: getTokensAuthorizationCodeGrant()")
    sdk.getTokensAuthorizationCodeGrant(authCode, null, function(err, tokenInfo) {
      if(err){
        reject(err)
      }
      //console.log("tokenInfo:"+ tokenInfo)
      // tokenInfo: {
      //  accessToken: 'ACCESS_TOKEN',
      //  refreshToken: 'REFRESH_TOKEN',
      //  acquiredAtMS: 1464129218402,
      //  accessTokenTTLMS: 3600000,
      // }

      resolve(tokenInfo)

      return //------------------
      var user_access_token = tokenInfo.accessToken
      var client = sdk.getBasicClient(user_access_token); // USER_ACCESS_TOKEN... use my Developer Token
      client.users.get(client.CURRENT_USER_ID, null, function(err, currentUser) {
        if(err){
          apiRequest.respond(false,{msg:"client.users.get error"})
          throw err

        }
        //console.log('Hello, ' + currentUser.name + '!');
        apiRequest.respond(true,{"folderListing":"to do... currentUser is (2)"+ currentUser.name})
      });
    });



  })

}
