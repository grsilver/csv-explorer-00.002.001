import {apiHandler as apiHandler} from './apiHandler.js';
import {displayResponseRows as displayResponseRows} from './displayResponseRows.js';
import {queryManager as queryManager} from './queryManager.js';
queryManager

var m = {};
export {m as submitHandler};

//https://github.com/github/fetch
var btn_template
m.init = function(){
  console.log('submitHandler.init()2');
  onWindowLoad(function(){
    //document.getElementById("btn_query").addEventListener("click", query);
    document.getElementById("btn_about").addEventListener("click", about);
    setPredefinedQueries();
  })
}

function setPredefinedQueries(){
  btn_template = document.getElementById("btn_template")
  var parentNode = btn_template.parentNode;
  parentNode.removeChild(btn_template);
  var btn
  queryManager.foreach(function(lbl,queryStr){
    btn = btn_template.cloneNode(true)
    parentNode.appendChild(btn);
    btn.innerHTML = lbl
    btn.addEventListener("click", function(){
      query(queryStr)
    });
  })
}

function query(queryStr){
  document.getElementById("input1").value = queryStr
  apiHandler.query(queryStr,function(success, objResp){
    if( success ){
      //console.log("query success: "+ JSON.stringify(objResp))
      displayResponseRows.display(objResp.apiResponse.rows)
    }
    else{
      console.log("query error: "+ JSON.stringify(objResp))
    }
  })
}
function about(){
  var miscParams = {a:1,b:2}
  apiHandler.about(miscParams,function(success, objResp){
    if( success ){
      console.log("about success: "+ JSON.stringify(objResp))
    }
    else{
      console.log("about error: "+ JSON.stringify(objResp))
    }
  })
}
function onWindowLoad(f){
  document.addEventListener("DOMContentLoaded", function(event) {
    f();
  });
}
