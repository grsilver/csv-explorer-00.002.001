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

  }

  dataBind(data){
    this.data = data

  }

  remove(){
    this.element.remove()
  }



  aquireMarkup (eleContainer){
    var t = this;
    return new Promise (function (resolve, reject) {

      new Promise (function (resolve, reject) {

        findElementOrLoadInclude(t.querySelectorStr ,t.includePath,eleContainer)
        .then(function(ele){
            resolve(ele)
        })
        .catch(function(err){
            reject(err)
        })
      })
      .then(function(ele){

        t.element = ele;
        t.onAquireMarkup(ele)
        ele.remove()
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
