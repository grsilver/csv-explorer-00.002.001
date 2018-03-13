import {findElementOrLoadInclude as findElementOrLoadInclude} from './findElementOrLoadInclude.js';
export {DataMarkup as DataMarkup};


class DataMarkup {
  constructor() {
    this.includePath = "/includes/response_panel.html"
    this.querySelectorStr = "#XXX"
    this.subElements = {}
    this.element = null
    this.data
  }

  onAquireMarkup(ele){
    // overwrite
  }

  dataBind(data){
    this.data = data

  }

  remove(){
    this.element.remove()
  }

  getElement(){
    return this.element
  }

  aquireMarkup (eleContainer){
    var t = this;
    return new Promise (function (resolve, reject) {
      if(t.element){
        resolve(t.element)
        return
      }
      findElementOrLoadInclude(t.querySelectorStr ,t.includePath,eleContainer)
      .then(function(eleTemplate){
        t.element = eleTemplate.cloneNode(true);
        t.onAquireMarkup(t.element)
        eleTemplate.remove()
        resolve(t.element)
      })
      .catch(function(err){
        reject(err)
      })
    })
  }

  log(str){
    console.log(this.constructor.name + ":"+ str)
  }

}
