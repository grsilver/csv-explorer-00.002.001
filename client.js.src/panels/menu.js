import {findElementOrLoadInclude as findElementOrLoadInclude} from '../lib/findElementOrLoadInclude.js';
import {forEach as forEach} from '../lib/forEach.js';

var m = {}
export {m as menu};
m.init = init
m.open = open
m.close = close
m.addItem = addItem

var _menu_container
var _menu_hamburger_icon
var _menu_items_container
var _menu_items_container_outer
var _menu_item
var _opened;
var _itemPlaceholderAry = []

function init(){
  console.log("menu: init")
  aquireMarkup()
  .then(function(menu_container){
    return bind2MarkUp(menu_container)
  })
  .then(function(){
    forEach(_itemPlaceholderAry,function(obj){
      addItem_afterMarkeup(obj.lbl,obj.onClick)
    })
  })
}

function addItem(lbl,onClick){
  if(_menu_items_container){
    addItem_afterMarkeup(lbl,onClick)
  }
  else{
    _itemPlaceholderAry.push({lbl:lbl,onClick:onClick})
  }
}

function addItem_afterMarkeup(lbl,onClick){
  var menu_item = _menu_item.cloneNode(true);
  _menu_items_container.appendChild(menu_item);
  menu_item.innerHTML = lbl
  menu_item.addEventListener("click",function(){
    close();
    onClick();
  });
}

function bind2MarkUp(menu_container){
  return new Promise(function (resolve, reject) {
    document.body.appendChild(menu_container);
    _menu_item = menu_container.querySelector(".menu_item");
    _menu_item.remove()
    _menu_items_container_outer = menu_container.querySelector("#menu_items_container_outer")
    _menu_items_container = menu_container.querySelector("#menu_items_container")
    _menu_hamburger_icon = menu_container.querySelector("#menu_hamburger_icon")
    _menu_hamburger_icon.addEventListener("click",function(){
      (_opened)?close():open()
    });
    close()
  })
}

function open(){
  if(_opened == true)
    return
  _opened = true
  _menu_items_container_outer.appendChild(_menu_items_container)
  _menu_hamburger_icon.classList.add("menu_hamburger_opened");
  _menu_items_container_outer.classList.add("menu_items_container_outer_opened")
  _menu_items_container_outer.classList.remove("menu_items_container_outer_closed");
}
function close(){
  if(_opened == false)
    return
  _opened = false;

  _menu_items_container.remove()
  _menu_hamburger_icon.classList.remove("menu_hamburger_opened");
  _menu_items_container_outer.classList.remove("menu_items_container_outer_opened")
  _menu_items_container_outer.classList.add("menu_items_container_outer_closed");

}

function aquireMarkup (){
  console.log("menu: aquireMarkup")
  return new Promise(function (resolve, reject) {
    findElementOrLoadInclude("#menu_container","/includes/menu.html")
    .then(function(ele){
      _menu_container = ele
      resolve(ele)
    })
    .catch(function(err){
      console.log("panelMenu: error:"+ err)
      reject(err)
    })
  })
}
