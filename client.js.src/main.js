import {panelManager as panelManager} from './panels/panelManager.js';
import {methodPanel as methodPanel} from './method/methodPanel.js';
import {submission_listener_responseHandler_cr8er as submission_listener_responseHandler_cr8er} from './response/submission_listener_responseHandler_cr8er.js';
import {boxManager as boxManager} from './box/boxManager.js';
import {queryPanel as queryPanel} from './query/queryPanel.js';


console.log("BEGIN")
panelManager.init()
.then(function(){
  //console.log("main.js: panelManager.init DONE");
  return methodPanel.init()
})
.then(function(){
  //console.log("main.js: methodManager.init DONE");
  return submission_listener_responseHandler_cr8er.init()
})
.then(function(){
  //console.log("main.js: submission_listener_responseHandler_cr8er.init DONE");
  return boxManager.init()
})
.then(function(){
  //console.log("main.js: boxManager.init DONE");
  return queryPanel.init()
})
.then(function(){
  console.log("FULLY LOADED")
})
.catch(function(err){
  debugger
  throw err
})
