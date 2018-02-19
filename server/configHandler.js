const config = require('../ssd-explorer.config.js');
var m = module.exports = {}
m.version = version;
m.forEachMethodRegistration = forEachMethodRegistration;

function version(){
  return config.version
}
function forEachMethodRegistration(callback){
  var a = config.registeredMethods;
  var i,reg,br
  for(i = 0; i < a.length; i++){
    br = callback(a[i],i)
    if(br)break
  }
}
