import {menu as menu} from './menu.js';
import {forEach as forEach}  from '../lib/forEach.js';


var m = {}
export {m as panelManager};
m.init = init
m.registerPanel = registerPanel
m.showPanel = showPanel
m.setTitle = setTitle
m.removeReg = removeReg


var _registrations = []
var _currentPanel



function init(){

  console.log("panelManager: init")
  return menu.init()
}

function setTitle(str){
  document.querySelector("#panel_title").innerHTML = str;
  return m
}

function removeReg(reg){
  var ary_temp = []
  forEach(_registrations,function(reg2,i,brk){
    if(reg2 != reg)
      ary_temp.push(reg2)
  })
  menu.removeItem(reg.lbl)
  _registrations = ary_temp
  return m
}

function registerPanel(lbl,elePanel){
  var reg = {
    lbl:lbl
    ,elePanel:elePanel
  }
  reg.setOnSHow = function(fn){
    reg.onShow = fn
  }
  reg.removeOnShow = function(){
    reg.onShow = null
  }
  _registrations.push(reg)
  menu.addItem(lbl,function(){
    showPanel(elePanel)
    if(reg.onShow)
      reg.onShow(reg)
  })
  reg.remove = function(){
    removeReg(reg)
  }
  return reg
}

function showPanel(elePanel){
  if(_currentPanel)
    _currentPanel.remove()

  _currentPanel = elePanel
  var reg = forEach(_registrations,function(reg,i,brk){
    if(reg.elePanel == elePanel)
      brk(reg)
  })

  if(reg){
    setTitle(reg.lbl)
  }

  document.querySelector("#panel_container").appendChild(elePanel)

  return m;
}
