import {forEach as forEach}  from '../lib/forEach.js';
import {Display_DataMarkup as Display_DataMarkup} from './Display_DataMarkup.js';


export {Display_DataMarkup_Table as Display_DataMarkup_Table};


class Display_DataMarkup_Table extends Display_DataMarkup {
  constructor() {
    super()
    this.querySelectorStr = ".response_table"
  }

  onAquireMarkup(ele){
    super.onAquireMarkup(ele)
    //m.elements.thead = ele.querySelector('*[template="temp"')
    this.subElements.thead = this.element.querySelector('thead')
    this.subElements.tbody = this.element.querySelector('tbody')
  }

  remove(){
    super.remove()
    this.subElements.thead.innerHTML = ""
    this.subElements.tbody.innerHTML = ""
  }

  dataBind (records){
    super.dataBind(records)
    var me = this
    forEach(records,function(record,i){
      if(i ==0)
        me.displayHeader(record)
      me.displayRow(record)
    })
  }

  displayHeader(record){
    var me = this
    forEach(record,function(val,key){
      var th = document.createElement("th");
      th.innerHTML = key
      me.subElements.thead.appendChild(th)
    })
  }

  displayRow(record){
    var tr = document.createElement("tr");
    this.subElements.tbody.appendChild(tr)
    forEach(record,function(val,key){
      var td = document.createElement("td");
      td.innerHTML = val
      tr.appendChild(td)
    })
  }

}
