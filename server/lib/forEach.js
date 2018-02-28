module.exports = forEach;


function forEach(source,callback){
  //if(source && source.length){
  if( typeof(NodeList) !== 'undefined' && NodeList.prototype.isPrototypeOf(source)){
    return forEachArrayItem(source,callback)
  }
  else if(source && Array.isArray(source)){
    return forEachArrayItem(source,callback)
  }
  else if(typeof(source) == "object"){
    return forEachObjectItem(source,callback)
  }
  else{
    throw new Error("forEach: is not an Array or Object")
  }

}

function forEachArrayItem(source,callback){
  var i;
  var boolBreak
  var returnVal

  for(i=0;i <source.length;i++){
    callback(source[i],i,fnBreak)
    if(boolBreak)
      break
  }
  function fnBreak(v){
    boolBreak = true
    returnVal = v
  }
  return returnVal
}
function forEachObjectItem(source,callback){
  var i;
  var boolBreak
  var returnVal

  var key;
  var count = 0;
  for(key in source){
    callback(source[key],key,fnBreak,count)
    if(boolBreak)
      break
    count ++
  }
  function fnBreak(v){
    boolBreak = true
    returnVal = v
  }
  return returnVal

}
