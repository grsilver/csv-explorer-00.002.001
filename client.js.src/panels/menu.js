import {findElementOrLoadInclude as findElementOrLoadInclude} from '../lib/findElementOrLoadInclude.js';
import {forEach as forEach} from '../lib/forEach.js';

var m = {}
export {m as menu};
m.init = init
m.open = open
m.close = close
m.addItem = addItem

var _menu_include
var _menu_hamburger_icon
var _menu_items_container
var _menu_items_container_outer
var _menu_item
var _opened;
var _itemPlaceholderAry = []

function init(){
  console.log("menu: init")
  findElementOrLoadInclude("#menu_include","/includes/menu.html")
  .then(function(ele){
    _menu_include = ele
    return bind2MarkUp(_menu_include)
  })
  .then(function(){ // add menu items called before bind2MarkUp
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

function bind2MarkUp(menu_include){
  return new Promise(function (resolve, reject) {

    // menu icon hamburger
    _menu_hamburger_icon = menu_include.querySelector("#menu_hamburger_icon");
    document.body.appendChild(_menu_hamburger_icon)
    _menu_hamburger_icon.addEventListener("click",function(){
      (_opened)?close():open()
    });

    _menu_items_container = menu_include.querySelector("#menu_items_container");
    _menu_items_container_outer = menu_include.querySelector("#menu_items_container_outer");

    var menu_placeholder = document.querySelector("#menu_placeholder");
    var parentNode = menu_placeholder.parentNode
    parentNode.insertBefore(_menu_items_container_outer,menu_placeholder);
    menu_placeholder.remove()

    _menu_item = menu_items_container_outer.querySelector(".menu_item");
    _menu_item.remove()

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

  //document.querySelector("#app_middle_left").classList.add("app_middle_item_menu_opened")
  //document.querySelector("#app_middle_center").classList.add("app_middle_item_menu_opened")

}
function close(){
  if(_opened == false)
    return
  _opened = false;

  _menu_items_container.remove()
  _menu_hamburger_icon.classList.remove("menu_hamburger_opened");
  _menu_items_container_outer.classList.remove("menu_items_container_outer_opened")
  _menu_items_container_outer.classList.add("menu_items_container_outer_closed");

  //document.querySelector("#app_middle_left").classList.remove("app_middle_item_menu_opened")
  //document.querySelector("#app_middle_center").classList.remove("app_middle_item_menu_opened")

}

function aquireMarkup (){
  console.log("menu: aquireMarkup")
  return new Promise(function (resolve, reject) {

  })
}
