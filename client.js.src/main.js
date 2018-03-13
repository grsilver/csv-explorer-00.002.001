import {methodManager as methodManager} from './method/methodManager.js';
import {submission_listener_responseHandler_cr8er as submission_listener_responseHandler_cr8er} from './response/submission_listener_responseHandler_cr8er.js';
import {boxManager as boxManager} from './box/boxManager.js';
import {panelManager as panelManager} from './panels/panelManager.js';



panelManager.init()
.then(function(){
  //log("main.js: panelManager.init DONE");
  return methodManager.init()
})
.then(function(){
  //log("main.js: methodManager.init DONE");
  return submission_listener_responseHandler_cr8er.init()
})
.then(function(){
  //log("main.js: submission_listener_responseHandler_cr8er.init DONE");
  return boxManager.init()
})
.then(function(){
  console.log("FULLY LOADED")
})
.catch(function(err){
  debugger
  throw err
})
