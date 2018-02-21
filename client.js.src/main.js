import {log as log} from './helpers/log.js';
import {methods_panel as methods_panel} from './method/methods_panel.js';
import {responseManager as responseManager} from './response/responseManager.js';


log("main.js");
responseManager.init()
methods_panel.init()
