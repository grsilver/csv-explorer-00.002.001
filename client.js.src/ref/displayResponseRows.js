import {apiHandler as apiHandler} from './apiHandler.js';

var m = {};
m.display = display;

export {m as displayResponseRows};

var thead;
var tbody;

function display(rows){
  thead = document.getElementById("responseTableHeader");
  tbody = document.getElementById("responseTableBody");
  tbody.innerHTML = ""
  thead.innerHTML = ""
  displayHeader(rows[0])
  displayRowS(rows)
}
function displayHeader(headerRow){
  var th
  var key
  for(key in headerRow){
    th = document.createElement("th");
    th.innerHTML = key;
    thead.appendChild(th)
  }
}
function displayRowS(rows){
  var row,tr
  var i
  for(i=0; i<rows.length; i++){
    row = rows[i];
    tr = document.createElement("tr");
    document.getElementById("responseTableHeader").appendChild(tr)
    displayRow(tr,row)
  }
}
function displayRow(tr,row){
  var td,key,val;
  for(key in row){
    td = document.createElement("td");
    val = row[key];
    td.innerHTML = val;
    tr.appendChild(td)
  }
}
