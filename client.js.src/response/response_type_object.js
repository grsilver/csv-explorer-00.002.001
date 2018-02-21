import _ from 'lodash';
import {response_type_base_extend as response_type_base_extend} from './response_type_base_extend.js';


var m = {}
export {m as response_type_object};

response_type_base_extend(m)

m.includePath = "/includes/response_panel.html"
m.querySelectorStr = "#response_object"

m.onGetMarkUp = function(ele){
  //elements.temp = ele.querySelector('*[template="temp"')
  console.log("not implemented")
}
m.dataBind = function(data){
  console.log("not implemented")
}
