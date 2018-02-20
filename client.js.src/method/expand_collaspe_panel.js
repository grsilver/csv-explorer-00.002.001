var m = {}
export {m as expand_collaspe_panel};

m.bind2UI = bind2UI
m.collapse = collapse
m.expand = expand

var btn_expand
var btn_collapse
var collapsed
var pnl_body
var pnl_container
var ele_title

function bind2UI(pnlContainer){
  pnl_container = pnlContainer
  pnl_body =  pnl_container.querySelector(".pnl_body");
  ele_title =  pnl_container.querySelector(".pnl_title");
  btn_expand = pnl_container.querySelector("#methods_panel_btnExpand");
  btn_collapse = pnl_container.querySelector("#methods_panel_btnCollapse");

  btn_expand.addEventListener("click",btnClick);
  btn_collapse.addEventListener("click",btnClick);
  btn_expand.remove()

}
function btnClick(){
  if(collapsed){
    expand()
  }
  else{
    collapse()
  }
}
function collapse(){
  if(collapsed)
    return

  collapsed = true
  ele_title.appendChild(btn_expand)
  btn_collapse.remove()
  pnl_container.removeChild(pnl_body)
  //pnl_body.remove()
}
function expand(){
  if(!collapsed)
    return

  collapsed = false
  ele_title.appendChild(btn_collapse)
  btn_expand.remove()
  pnl_container.appendChild(pnl_body)
}
