import _ from 'lodash';
import {response_type_base_extend as response_type_base_extend} from './response_type_base_extend.js';


var m = {}
export {m as response_type_table};

response_type_base_extend(m)

m.includePath = "/includes/response_panel.html"
m.querySelectorStr = "#response_table"

m.onGetMarkUp = function(ele){
  //m.elements.thead = ele.querySelector('*[template="temp"')
  m.elements.thead = ele.querySelector('thead')
  m.elements.tbody = ele.querySelector('tbody')
  console.log("not implemented")
}
m.dataBind = function(records){
  console.log("not implemented")
  m.elements.tbody.innerHTML = ""
  m.elements.thead.innerHTML = ""
  _.forEach(records,function(record,i){
    if(i ==0)
      displayHeader(record)
    displayRow(record)
  })
}

function displayHeader(record){

  _.forEach(record,function(val,key){
    var th = document.createElement("th");
    th.innerHTML = key
    m.elements.thead.appendChild(th)
  })
}
function displayRow(record){
  var tr = document.createElement("tr");
  m.elements.tbody.appendChild(tr)
  _.forEach(record,function(val,key){
    var td = document.createElement("td");
    td.innerHTML = val
    tr.appendChild(td)
  })
}
