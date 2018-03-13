import {forEach as forEach}  from '../lib/forEach.js';
import {apiCallHandler as apiCallHandler} from '../api/apiCallHandler.js';
import {findElementOrLoadInclude as findElementOrLoadInclude} from '../lib/findElementOrLoadInclude.js';
import {panelManager as panelManager} from '../panels/panelManager.js';
import {SubmitHandler as SubmitHandler} from '../method/SubmitHandler.js';
import {textAreaHandler as textAreaHandler} from './textAreaHandler.js';
import {cannedQueriesManager as cannedQueriesManager} from './cannedQueriesManager.js';



var m = {}
export {m as queryPanel};
m.init = init


//private
var _pnl;


function init(){
  //tempData(function(response){ // need to uncomment import

  return new Promise(function(resolve,reject){

    findElementOrLoadInclude("#query_panel","/includes/query_panel.html")
    .then(function(ele){
      onMarkUp(ele)
      resolve()
    })
    .catch(reject)
  })
}
function onMarkUp(ele){
  //console.log(onMarkUp)
  _pnl = ele;
  panelManager.registerPanel("Query Manager",_pnl).setOnSHow(function(reg){
    reg.removeOnShow() // prep on the 1st time
    var textArea =
    textAreaHandler.bind2Markup(_pnl)
  })
  cannedQueriesManager.bind2Markup(_pnl)
  _pnl.querySelector("#btnSubmit").addEventListener("click",function(){
    query()
  });
}
function query(){

  var sql = textAreaHandler.getValue()

  console.log("query:" + sql)

  var methodRegistrationData = {
    requestPath : "db.query"
    ,filePath:"db/query.js"
    ,methodName:"query_api"
    ,description:"an open ended query call. Default: list frist 5 rows"
    ,access : ["tier2"]
    ,params : [
      {name:"sql",defaultValue:"SELECT * FROM SSD1 LIMIT 5"}
    ]
    ,returnType:"ROWS"
    ,implemented:"90"
  }

  var methodParams = {sql:sql}
  var submitHandler = new SubmitHandler(methodRegistrationData,methodParams)
  submitHandler.submit(methodParams)

  //return apiCallHandler.call("listMethods",methodParams)
}
