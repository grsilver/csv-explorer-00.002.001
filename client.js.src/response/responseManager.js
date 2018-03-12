//responseManager
import {findElementOrLoadInclude as findElementOrLoadInclude} from '../lib/findElementOrLoadInclude.js';
import {methods_panel as methods_panel} from '../method/methods_panel.js';
import {log as log} from '../lib/log.js';



import {Response_DataMarkup_Object as Response_DataMarkup_Object} from './Response_DataMarkup_Object.js';
import {Response_DataMarkup_String as Response_DataMarkup_String} from './Response_DataMarkup_String.js';
import {Response_DataMarkup_Table as Response_DataMarkup_Table} from './Response_DataMarkup_Table.js';
import {panelManager as panelManager} from '../panels/panelManager.js';

var m = {}
export {m as responseManager};

m.init = init;
var _pnl
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
    _pnl = ele;
    panelManager.registerPanel("API Result",_pnl)
    subElements.response_container = ele.querySelector('*[id="response_container"')
    subElements.response_title = ele.querySelector('*[id="response_title"')

    response_DataMarkup_Object.aquireMarkup(ele)
    response_DataMarkup_String.aquireMarkup(ele)
    response_DataMarkup_Table.aquireMarkup(ele)

  })
  .catch(function(err){
    throw err
  })
}

function onSubmit(evt,scope,listenerReg){
  if(last_response_DataMarkup)
    last_response_DataMarkup.remove()
}

function onSuccess(evt,scope,listenerReg){

  panelManager.showPanel(_pnl)

  response_title.innerHTML = evt.methodRegistrationData.requestPath

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

  subElements.response_container.appendChild(responseDataMarkup.element)
  dealWith_last_response_DataMarkup(responseDataMarkup)
  responseDataMarkup.dataBind(evt.response)

}

function onError(evt,scope,listenerReg){
  panelManager.showPanel(_pnl)
  //if( evt.error instanceof Error){debugger}
  response_title.innerHTML = "ERROR RETURNED"

  subElements.response_container.appendChild(response_DataMarkup_Object.element)
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
