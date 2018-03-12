import {log as log} from './lib/log.js';
import {methods_panel as methods_panel} from './method/methods_panel.js';
import {responseManager as responseManager} from './response/responseManager.js';
import {boxManager as boxManager} from './box/boxManager.js';
import {panelManager as panelManager} from './panels/panelManager.js';


log("main.js");
panelManager.init()
responseManager.init()
methods_panel.init()
boxManager.init()
