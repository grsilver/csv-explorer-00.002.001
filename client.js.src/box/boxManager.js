import {findElementOrLoadInclude as findElementOrLoadInclude} from '../lib/findElementOrLoadInclude.js';
import {panelManager as panelManager} from '../panels/panelManager.js';

var m = {}
export {m as boxManager};
m.init = init

var _pnl


function init(){
  console.log("boxManager: init")
  return new Promise(function(resolve,reject){
    findElementOrLoadInclude("#box_panel","/includes/box_panel.html")
      .then(function(ele){
        console.log("boxManager: got markup")
        _pnl = ele
        panelManager.registerPanel("Box Integration",_pnl)
        resolve()
      })
      .catch(reject)
  })

}