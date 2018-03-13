import {panelManager as panelManager} from './panels/panelManager.js';
import {methodPanel as methodPanel} from './method/methodPanel.js';
import {responsePanel as responsePanel} from './response/responsePanel.js';
import {boxPanel as boxPanel} from './box/boxPanel.js';
import {queryPanel as queryPanel} from './query/queryPanel.js';


console.log("BEGIN")
panelManager.init()
.then(function(){
  //console.log("main.js: panelManager.init DONE");
  return methodPanel.init()
})
.then(function(){
  //console.log("main.js: methodPanel.init DONE");
  return responsePanel.init()
})
.then(function(){
  //console.log("main.js: responsePanel.init DONE");
  return boxPanel.init()
})
.then(function(){
  //console.log("main.js: boxPanel.init DONE");
  return queryPanel.init()
})
.then(function(){
  console.log("FULLY LOADED")
})
.catch(function(err){
  debugger
  throw err
})
