import {log as log} from './helpers/log.js';
import {panelContainerMain as panelContainerMain} from './panelContainerMain.js';
import {panelMethodList as panelMethodList} from './methodList/panelMethodList.js';


log("main.js");
panelContainerMain.bindToUi(function(){
  panelMethodList.show()
})
