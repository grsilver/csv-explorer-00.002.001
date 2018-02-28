
/*
https://github.com/box/box-node-sdk
https://conviva.app.box.com/developers/console/app/536698/configuration
Woot! Your app has been created.
Make your first API call and retrieve a list of folders from your personal Box account using a developer token. This token will expire after 60 minutes.

curl https://api.box.com/2.0/folders/0 -H \
"Authorization: Bearer sMUm6F9cQwj2hBclPG1Gq3CkdWi7qIob"
View Your App

*/
var BoxSDK = require('box-node-sdk');
var boxHandler = {}



module.exports = boxHandler;
boxHandler.handleApiCall = handleApiCall;
boxHandler.folderListing = folderListing
boxHandler.OAuthUrl = OAuthUrl

var clientID = "bl6m53o5y9yjb96i0eo9u614c6b98utq"
var clientSecret = "YRMFMgp1ICH5epoc6ePD3mZLqNYHFLSZ"


function handleApiCall(apiRequest,params){


  var authCode = params.authCode

  if(!authCode && params.method!="OAuthUrl"){
    apiRequest.respond(false,{type:"no AuthCode"})
    return;
  }

  var method = params.method //listing
  boxHandler[method](apiRequest,params)

}

function folderListing(apiRequest,params){
  //apiRequest.respond(true,{})

  var authCode = params.authCode
  //user_access_token=  "9m5zb6CUrQQr09pQGR1uthImX1SAdUEm"
  //user_access_token= "jP7IXJiVqyXpdBQiYQXXxJP0E0uCANpK"

  var sdk = new BoxSDK({
    clientID: clientID,
    clientSecret: clientSecret
  });

  // Create a basic API client



  console.log("authCode:"+ authCode)
  sdk.getTokensAuthorizationCodeGrant(authCode, null, function(err, tokenInfo) {
    if(err)
      throw err
    console.log("tokenInfo:"+ tokenInfo)
  	// tokenInfo: {
  	//  accessToken: 'ACCESS_TOKEN',
  	//  refreshToken: 'REFRESH_TOKEN',
  	//  acquiredAtMS: 1464129218402,
  	//  accessTokenTTLMS: 3600000,
  	// }
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





}

function OAuthUrl(apiRequest,params){

  console.log("OAuthUrl")

  //https://developer.box.com/docs/oauth-20
  // https://account.box.com/api/oauth2/authorize?response_type=code&client_id=bl6m53o5y9yjb96i0eo9u614c6b98utq&state=security_token%3DKnhMJatFipTAnM0nHlZA&redirect_uri=http://127.0.0.1?box=true
  var url = 'https://account.box.com/api/oauth2/authorize?response_type=code&client_id='+clientID;
  url += "&state=security_token%" + Math.floor((Math.random() * 10000) + 1);
  // redirects to : https://127.0.0.1/?from_box=1&state=security_token%3DKnhMJatFipTAnM0nHlZA&code=0Ec0RpJTouP4gaFWZs5oCzFv7OY8YutS
  if(params.username)
    url += "&box_login="+params.username

  apiRequest.respond(true,{url:url})

}

function getFolderItmes(user_access_token){
  //https://github.com/box/box-node-sdk/blob/master/docs/folders.md#get-a-folders-items
  var user_access_token;
  var client = getClient(user_access_token)
  var folderID = "";
  client.folders.getItems(
      folderID,
      {
          fields: 'name,modified_at,size,url,permissions,sync_state',
          offset: 0,
          limit: 25
      },
      callback
  );

}

function getClient(user_access_token){
  var sdk = new BoxSDK({
    clientID: clientID,
    clientSecret: clientSecret
  });

  // Create a basic API client
  var client = sdk.getBasicClient(user_access_token); // USER_ACCESS_TOKEN... use my Developer Token

  return client
}


function temp(){
  // Initialize SDK


  var sdk = new BoxSDK({
    clientID: clientID,
    clientSecret: clientSecret
  });

  // Create a basic API client
  var client = sdk.getBasicClient('sMUm6F9cQwj2hBclPG1Gq3CkdWi7qIob'); // USER_ACCESS_TOKEN... use my Developer Token

  // Get some of that sweet, sweet data!
  client.users.get(client.CURRENT_USER_ID, null, function(err, currentUser) {
    if(err) throw err;
    console.log('Hello, ' + currentUser.name + '!');
  });

  // The SDK also supports Promises
  client.users.get(client.CURRENT_USER_ID)
  	.then(user => console.log('Hello', user.name, '!'))
  	.catch(err => console.log('Got an error!', err));

}
