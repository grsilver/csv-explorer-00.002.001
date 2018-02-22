import {forEach as forEach}  from './forEach.js';
export {matchElementsWithData as matchElementsWithData};

matchElementsWithData.basicDataBind = basicDataBind // can be used as a callback

function matchElementsWithData(parentElement,data,callBack){ //callBack(ele,dataNameString,val)
  callBack = callBack || basicDataBind
  var elements = parentElement.querySelectorAll("*[data]")
  forEach(elements,function(ele){
    var dataNameString = ele.getAttribute("data")
    var val
    try{
      val = eval(dataNameString)
    }
    catch(e){
      val =  `Error: can't parse <${ele.tagName} data="${dataNameString}" :`+ e.message
    }
    callBack(ele,dataNameString,val)
  })
}


function basicDataBind(ele,dataNameString,val){
  var tagName = ele.tagName.toLowerCase()
  if( tagName == "input" || tagName == "textarea"){
    ele.value = val
  }
  else{
    ele.innerHTML = val
  }
}
