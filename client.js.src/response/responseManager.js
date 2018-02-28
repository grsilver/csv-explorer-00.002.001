//responseManager
import {findElementOrLoadInclude as findElementOrLoadInclude} from '../lib/findElementOrLoadInclude.js';
import {methods_panel as methods_panel} from '../method/methods_panel.js';
import {log as log} from '../lib/log.js';



import {Response_DataMarkup_Object as Response_DataMarkup_Object} from './Response_DataMarkup_Object.js';
import {Response_DataMarkup_String as Response_DataMarkup_String} from './Response_DataMarkup_String.js';
import {Response_DataMarkup_Table as Response_DataMarkup_Table} from './Response_DataMarkup_Table.js';

var m = {}
export {m as responseManager};

m.init = init;
m.element
var pnl
var subElements = {}

var response_DataMarkup_Object = new Response_DataMarkup_Object()
var response_DataMarkup_String = new Response_DataMarkup_String()
var response_DataMarkup_Table = new Response_DataMarkup_Table()
var last_response_DataMarkup;

function init(){

  methods_panel.eventManager.addListener.cr8MethodRecord(function(evt,scope,listenerReg){
    //debugger
    var addListener = evt.methodRecord.eventManager.addListener
    addListener.submit(onSubmit)
    addListener.responseSuccess(onSuccess)
    addListener.responseError(onError)
  })

  aquireMarkup().then(function(ele){
    pnl = m.element = ele;
    subElements.response_panel_body = ele.querySelector('*[id="response_panel_body"')

    response_DataMarkup_Object.aquireMarkup(ele)
    response_DataMarkup_String.aquireMarkup(ele)
    response_DataMarkup_Table.aquireMarkup(ele)

    document.body.appendChild(ele)

  })
  .catch(function(e){
    e.message = "panelMethodList got list but error with bindToUI: " + e.message
    throw e
  })
}

function onSubmit(evt,scope,listenerReg){
  if(last_response_DataMarkup)
    last_response_DataMarkup.remove()
}

function onSuccess(evt,scope,listenerReg){
  methods_panel.collapse()

  var returnType = evt.methodRegistrationData.returnType
  var responseDataMarkup

  if(returnType =="OBJECT_ARRAY" && Array.isArray(evt.response) && typeof evt.response[0]==="object"){
    responseDataMarkup = response_DataMarkup_Table
  }
  else if(typeof evt.response==="object"){
    responseDataMarkup = response_DataMarkup_Object
  }
  else
    responseDataMarkup = response_DataMarkup_String

  subElements.response_panel_body.appendChild(responseDataMarkup.element)
  dealWith_last_response_DataMarkup(responseDataMarkup)
  responseDataMarkup.dataBind(evt.response)

}

function onError(evt,scope,listenerReg){
  methods_panel.collapse()
  //if( evt.error instanceof Error){debugger}
  debugger
  subElements.response_panel_body.appendChild(response_DataMarkup_Object.element)
  dealWith_last_response_DataMarkup(response_DataMarkup_Object)
  response_DataMarkup_Object.dataBind(evt.error)

}

function dealWith_last_response_DataMarkup(current_response_DataMarkup){
  last_response_DataMarkup = current_response_DataMarkup
}

function aquireMarkup (callback){
  log("aquireMarkup")
  return new Promise(function (resolve, reject) {
    findElementOrLoadInclude("#response_panel","/includes/response_panel.html")
    .then(function(ele){
      resolve(ele)
    })
    .catch(function(err){
      log("api_listMethods: error:"+ err)
      reject(err)
    })
  })
}
