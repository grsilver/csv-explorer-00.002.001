const config = require('../../ssd-explorer.config.js');

var m = module.exports = {}
m.host = host;
m.user = user;
m.password = password;
m.database = database;


function host(){
  return config.host
}
function user(){
  return config.user
}
function password(){
  return config.password
}
function database(){
  return config.database
}
