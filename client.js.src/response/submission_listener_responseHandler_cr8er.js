//responseManager
import {ResponseHandler_WithDataMarkUps as ResponseHandler_WithDataMarkUps} from './ResponseHandler_WithDataMarkUps.js';
import {responseManagerPanel as responseManagerPanel} from './responseManagerPanel.js';
import {SubmitHandler as SubmitHandler} from '../method/SubmitHandler.js';
import {EventManager as EventManager} from '../lib/EventManager.js';





import {panelManager as panelManager} from '../panels/panelManager.js';

var m = {}
export {m as submission_listener_responseHandler_cr8er};

m.init = init;
m.eventManager = new EventManager(m).registerEvent("newResponseHandler")



function init(){

  SubmitHandler.eventManager.addListener.newSubmission(onNewSubmission)

  return new Promise(function(resolve,reject){
    responseManagerPanel.init()
    .then(resolve)
    .catch(reject)
  })

}


function onNewSubmission(evt){
  var submitHandler = evt.submitHandler
  var responseHandler = new ResponseHandler_WithDataMarkUps(submitHandler)
  m.eventManager.dispatch.newResponseHandler({responseHandler:responseHandler})
}
