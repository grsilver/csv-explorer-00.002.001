import {menu as menu} from './menu.js';
import {forEach as forEach}  from '../lib/forEach.js';


var m = {}
export {m as panelManager};
m.init = init
m.registerPanel = registerPanel
m.showPanel = showPanel


var _registrations = []
var _currentPanel

function init(){
  console.log("panelManager: init")
  menu.init()
}

function registerPanel(lbl,elePanel){
  _registrations.push({
    lbl:lbl
    ,elePanel:elePanel
  })
  menu.addItem(lbl,function(){
    showPanel(elePanel)
  })
}

function showPanel(elePanel){
  if(_currentPanel)
    _currentPanel.remove()

  _currentPanel = elePanel
  var reg = forEach(_registrations,function(reg,i,brk){
    if(reg.elePanel == elePanel)
      brk(reg)
  })

  var title = "Panel"
  if(reg){
    title = reg.lbl
  }
  
  document.querySelector("#panel_title").innerHTML = title;
  document.querySelector("#panel_container").appendChild(elePanel)
}
