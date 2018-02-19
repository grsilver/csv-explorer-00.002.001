import {log as log} from './helpers/log.js';
import {addWindowLoadedListener as addWindowLoadedListener} from './helpers/addWindowLoadedListener.js';
import {EventListenerManager as EventListenerManager} from './helpers/EventListenerManager.js';





var m = {}
export {m as panelContainerMain};

m.element = null;
m.bindToUi = bindToUi
m.showPanel = showPanel
var eventListenerManager
  = new EventListenerManager(m)
  .setMethodAssignmentScope(m)
  .registerEvent("ShowPanel")
/* above creates:
  t.addShowPanelListener
  t.removeShowPanelListener
  t.broadcastShowPanel
*/

var eventListenerManager
  = new EventListenerManager(m)
  .setMethodAssignmentScope(m)
  .registerEvent("ShowPanel")



function bindToUi(callback){
  addWindowLoadedListener(function(){
    m.element = document.querySelector("#panel1_container");
    if(callback)
      callback(m)
  })
}

function updateTitle(str){
  m.element.querySelector("#panel1_title").innerHTML = str
}
function getBodyElement(){
  return   m.element.querySelector("#panel1_body");
}

function showPanel(panelHandler){
  if(m.currentPanelHandler){
    m.currentPanelHandler.remove()
  }
  updateTitle(panelHandler.title)
  var eleBody = getBodyElement()
  eleBody.innerHTML = ""
  eleBody.appendChild(panelHandler.element)
  m.currentPanelHandler = panelHandler
  m.broadcastShowPanel({panelHandler:panelHandler})
}
