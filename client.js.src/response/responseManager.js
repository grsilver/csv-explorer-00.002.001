//responseManager
import {findElementOrLoadInclude as findElementOrLoadInclude} from '../helpers/findElementOrLoadInclude.js';
import {methods_panel as methods_panel} from '../method/methods_panel.js';
import _ from 'lodash';
import {log as log} from '../helpers/log.js';


import {response_type_error as response_type_error} from './response_type_error.js';
import {response_type_object as response_type_object} from './response_type_object.js';
import {response_type_string as response_type_string} from './response_type_string.js';
import {response_type_table as response_type_table} from './response_type_table.js';

var m = {}
export {m as responseManager};

m.init = init;
var pnl
var elements = {}

function init(){

  methods_panel.eventManager.addListener.cr8MethodRecord(function(evt,scope,listenerReg){
    //debugger
    var addListener = evt.methodRecord.eventManager.addListener
    addListener.submit(onSubmit)
    addListener.responseSuccess(onSuccess)
    addListener.responseError(onError)
  })

  getMarkup().then(function(ele){
    pnl = m.element = ele;
    elements.response_panel_body = ele.querySelector('*[id="response_panel_body"')
    //elements.template_cell_default = ele.querySelector('*[template="template_cell_default"')
    //elements.response_table = ele.querySelector('#response_table')
    //elements.response_object = ele.querySelector('#response_object')

    //elements.response_table.remove()
    //elements.response_object.remove()
    response_type_error.getMarkup(ele)
    response_type_object.getMarkup(ele)
    response_type_string.getMarkup(ele)
    response_type_table.getMarkup(ele)

    document.body.appendChild(ele)

  })
  .catch(function(e){
    e.message = "panelMethodList got list but error with bindToUI: " + e.message
    throw e
  })


}

function onSubmit(evt,scope,listenerReg){

}

function onSuccess(evt,scope,listenerReg){

  var returnType = evt.methodRegistrationData.returnType
  var responseHandler
  if(returnType =="OBJECT")
    responseHandler = response_type_object
  else if(returnType =="OBJECT_ARRAY")
    responseHandler = response_type_table
  else
    responseHandler = response_type_string

  elements.response_panel_body.appendChild(responseHandler.element)
  responseHandler.dataBind(evt.response)

}

function onError(evt,scope,listenerReg){
  throw evt.error
  elements.response_panel_body.appendChild(response_type_error.element)
  response_type_error.dataBind(evt.error)
}

function getMarkup (callback){
  log("getMarkup")
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
