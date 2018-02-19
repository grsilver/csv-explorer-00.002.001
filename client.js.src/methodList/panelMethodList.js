import _ from 'lodash';
import {log as log} from '../helpers/log.js';
import {EventListenerManager as EventListenerManager} from '../helpers/EventListenerManager.js';
import {apiCallHandler as apiCallHandler} from '../api/apiCallHandler.js';
import {MethodRecord as MethodRecord} from './MethodRecord.js';
//import {addWindowLoadedListener as addWindowLoadedListener} from '../helpers/addWindowLoadedListener.js';
import {document_ready as document_ready} from '../helpers/document_ready.js';



var m = {}
export {m as panelMethodList};
m.init = init
m.element = null
m.expand = expand// todo
m.collapse = collapse// todo


//private
var pnl;
var methodRecordTemplate
function init(){
  //getTempList(function(response){
  api_listMethods(function(response){
    log("list got")
    try{
      bindToUi(function(){
        log("post bindToUi")
        dataBind(response)
      })
    }
    catch(e){
      e.message = "panelMethodList got list but error with bindToUI" + e.message
      throw e
    }
  })
}
function handleLoadError(error){
  throw error
}
function bindToUi (callback){
  log("bindToUi()1")
  document_ready(function(){
    log("bindToUi()2")
    pnl = m.element = document.querySelector("#panelMethodList");
    methodRecordTemplate = pnl.querySelector('*[template="method_record"]');
    methodRecordTemplate.remove();
    if(callback)
      callback()
  })
}
function expand(){ // todo

}
function collapse(){// todo

}
function dataBind(dataRecordS){
  _.forEach(dataRecordS,dataBindRecord)
}
function dataBindRecord(dataRecord){
  var methodRecord = new MethodRecord()
  var methodRecordEle  = methodRecordTemplate.cloneNode(true);
  pnl.appendChild(methodRecordEle)
  methodRecord.setElement(methodRecordEle).dataBind(dataRecord)
}
function api_listMethods(callback){
  //call(methodPath,methodParam,callback){
  apiCallHandler.call("listMethods",{}).then(function(objResp){
    var ary = objResp.response
    callback(ary)
  })
  .catch(function (err) {
    handleLoadError({message:"failed to load list",innerError:err})
  })
}
function getTempList(callback){
  var ary = [
    {
      requestPath : "importSSD.importFile"
      ,filePath:"importSSD/main.js"
      ,methodName:"importFile"
      ,description:"description1 description1"
      ,access : {}
      ,params : [
        {name:"param1"}
        ,{name:"param2"}
      ]
    }
    ,{
      requestPath : "about"
      ,filePath:"about.js"
      ,methodName:null
      ,description:"description2 description2"
      ,access : {}
      ,params : [
        {name:"param1"}
        ,{name:"param2"}
      ]
    }
  ]
  callback(true,ary)
}
