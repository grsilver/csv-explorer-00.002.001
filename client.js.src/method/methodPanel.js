import {forEach as forEach}  from '../lib/forEach.js';
import {log as log} from '../lib/log.js';
import {apiCallHandler as apiCallHandler} from '../api/apiCallHandler.js';
import {MethodHandler as MethodHandler} from './MethodHandler.js';
//import {expand_collaspe_panel as expand_collaspe_panel} from './expand_collaspe_panel.js';
//import {tempData as tempData} from './tempData.js';
import {findElementOrLoadInclude as findElementOrLoadInclude} from '../lib/findElementOrLoadInclude.js';
import {panelManager as panelManager} from '../panels/panelManager.js';



var m = {}
export {m as methodPanel};
m.init = init
m.methodSubmitted = methodSubmitted

//m.collapse = expand_collaspe_panel.collapse
//m.expand = expand_collaspe_panel.expand


//private
var _pnl;
var _methodRecordTemplate
var _aryMethodInfoRecords
function init(){
  //tempData(function(response){ // need to uncomment import

  return new Promise(function(resolve,reject){
    apiCallHandler.call("listMethods",{})
    .then(function(response){
      _aryMethodInfoRecords = response
      _aryMethodInfoRecords = _aryMethodInfoRecords.sort(function(a, b){
        if(a.requestPath < b.requestPath) return -1;
        if(a.requestPath > b.requestPath) return 1;
        return 0;
      })
      return findElementOrLoadInclude("#methods_panel","/includes/methods_panel.html")
    })
    .then(function(ele){
      _pnl = ele;
      _methodRecordTemplate = ele.querySelector('*[template="method_record"')
      _methodRecordTemplate.remove();
      panelManager.registerPanel("API Methods",_pnl)
      panelManager.showPanel(_pnl)
      dataBind(_aryMethodInfoRecords)
      resolve()
    })
    .catch(reject)
  })

}
function methodSubmitted(){

}
function dataBind(dataRecordS){
  log("dataBind")
  forEach(dataRecordS,dataBindRecord)
}
function dataBindRecord(dataRecord){
  var methodHandler = new MethodHandler()
  var methodEle  = _methodRecordTemplate.cloneNode(true);
  _pnl.querySelector("#methods_container").appendChild(methodEle)
  methodHandler.setElement(methodEle).dataBind(dataRecord)
}
