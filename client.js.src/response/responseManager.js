//responseManager
import {findElementOrLoadInclude as findElementOrLoadInclude} from '../helpers/findElementOrLoadInclude.js';
import {methods_panel as methods_panel} from '../method/methods_panel.js';

var m = {}
export {m as responseManager};

m.init = init;


function init(){

  methods_panel.eventManager.addListener.cr8MethodRecord(function(evt,scope,listenerReg){
    //debugger
    var addListener = evt.methodRecord.eventManager.addListener
    addListener.submit(onSubmit)
    addListener.responseSuccess(onSuccess)
    addListener.responseError(onError)
  })
}

function onSubmit(evt,scope,listenerReg){
  debugger
}

function onSuccess(evt,scope,listenerReg){
  debugger
}

function onError(evt,scope,listenerReg){
  debugger
}
