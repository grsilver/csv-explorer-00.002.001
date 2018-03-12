import {forEach as forEach}  from '../lib/forEach.js';
import {log as log} from '../lib/log.js';
import {EventManager as EventManager} from '../lib/EventManager.js';
import {apiCallHandler as apiCallHandler} from '../api/apiCallHandler.js';
import {MethodRecord as MethodRecord} from './MethodRecord.js';
//import {expand_collaspe_panel as expand_collaspe_panel} from './expand_collaspe_panel.js';
//import {tempData as tempData} from './tempData.js';
import {findElementOrLoadInclude as findElementOrLoadInclude} from '../lib/findElementOrLoadInclude.js';
import {panelManager as panelManager} from '../panels/panelManager.js';



var m = {}
export {m as methods_panel};
m.init = init

//m.collapse = expand_collaspe_panel.collapse
//m.expand = expand_collaspe_panel.expand
m.eventManager = new EventManager(m).registerEvent("cr8MethodRecord")


//private
var _pnl;
var _methodRecordTemplate
var _aryMethodInfoRecords
function init(){
  //tempData(function(response){ // need to uncomment import

  apiCallHandler.call("listMethods",{})
  .then(function(objResp){
    _aryMethodInfoRecords = objResp.response
    return findElementOrLoadInclude("#methods_panel","/includes/methods_panel.html")
  })
  .then(function(ele){
    _pnl = ele;
    _methodRecordTemplate = ele.querySelector('*[template="method_record"')
    _methodRecordTemplate.remove();
    panelManager.registerPanel("API Methods",_pnl)
    panelManager.showPanel(_pnl)
    dataBind(_aryMethodInfoRecords)
  })
  .catch(function(err){
    throw err
  })

}
function dataBind(dataRecordS){
  log("dataBind")
  forEach(dataRecordS,dataBindRecord)
}
function dataBindRecord(dataRecord){
  var methodRecord = new MethodRecord()
  var methodRecordEle  = _methodRecordTemplate.cloneNode(true);
  _pnl.querySelector("#methods_container").appendChild(methodRecordEle)
  methodRecord.setElement(methodRecordEle).dataBind(dataRecord)
  m.eventManager.dispatch.cr8MethodRecord({methodRecord:methodRecord})
}
