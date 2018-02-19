import _ from 'lodash';
import {log as log} from '../helpers/log.js';
import {EventListenerManager as EventListenerManager} from '../helpers/EventListenerManager.js';
import {apiCallHandler as apiCallHandler} from '../api/apiCallHandler.js';
import {MethodRecord as MethodRecord} from './MethodRecord.js';
import {panelContainerMain as panelContainerMain} from '../panelContainerMain.js';



var m = {}
export {m as panelMethodList};

m.element = null;
m.show = show
m.remove = remove
m.title = "Method Lists"

var pnl;
var methodRecordTemplate




function remove(){
  if(!m.element.parentNode )
    m.element.parentNode.remove(m.element)
}
function show(){
  prepUI()
  panelContainerMain.showPanel(m)
  getList(function(success,ary){
  //getTempList(function(success,ary){
    if(!success)
      throw "failed to load list"
    dataBind(ary)
  })
}
function prepUI(){
  pnl = m.element = document.querySelector("#methodList_pnl");
  methodRecordTemplate = pnl.querySelector('*[template="method_record"]');
  methodRecordTemplate.remove();
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
function getList(callback){
  //call(methodPath,methodParam,callback){
  apiCallHandler.call("listMethods",{},function(success, objResp){
    if(!success){
      callback(false,objResp)
    }
    var ary = objResp.response.methods
    callback(success,ary)
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
