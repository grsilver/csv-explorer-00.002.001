import _ from 'lodash';
import {log as log} from '../helpers/log.js';
import {EventListenerManager as EventListenerManager} from '../helpers/EventListenerManager.js';
import {apiCallHandler as apiCallHandler} from '../api/apiCallHandler.js';
import {MethodRecord as MethodRecord} from './MethodRecord.js';
import {expand_collaspe_panel as expand_collaspe_panel} from './expand_collaspe_panel.js';
//import {tempData as tempData} from './tempData.js';
import {findElementOrLoadInclude as findElementOrLoadInclude} from '../helpers/findElementOrLoadInclude.js';



var m = {}
export {m as methods_panel};
m.init = init
m.element = null
m.collapse = expand_collaspe_panel.collapse
m.expand = expand_collaspe_panel.expand


//private
var pnl;
var methodRecordTemplate
function init(){
  //tempData(function(response){ // need to uncomment import
  api_listMethods(function(response){
    log("api_listMethods")
    getMarkup().then(function(ele){
      pnl = m.element = ele;
      methodRecordTemplate = ele.querySelector('*[template="method_record"')
      methodRecordTemplate.remove();
      document.body.appendChild(pnl);
      expand_collaspe_panel.bind2UI(pnl)
      dataBind(response)
      m.expand()
    })
    .catch(function(e){
      e.message = "panelMethodList got list but error with bindToUI: " + e.message
      throw e
    })
  })
}
function handleLoadError(error){
  throw error
}
function getMarkup (callback){
  log("getMarkup")
  return new Promise(function (resolve, reject) {
    findElementOrLoadInclude("#methods_panel","/includes/methods_panel.html")
    .then(function(ele){
      resolve(ele)
    })
    .catch(function(err){
      log("api_listMethods: error:"+ err)
      reject(err)
    })
  })
}
function dataBind(dataRecordS){
  log("dataBind")
  _.forEach(dataRecordS,dataBindRecord)
}
function dataBindRecord(dataRecord){
  var methodRecord = new MethodRecord()
  var methodRecordEle  = methodRecordTemplate.cloneNode(true);
  pnl.querySelector(".pnl_body").appendChild(methodRecordEle)
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
