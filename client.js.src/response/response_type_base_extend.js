import {findElementOrLoadInclude as findElementOrLoadInclude} from '../helpers/findElementOrLoadInclude.js';

export {response_type_base_extend as response_type_base_extend};

function response_type_base_extend(m){

  m.getMarkup = getMarkup
  m.includePath = "/includes/response_panel.html"
  m.querySelectorStr = "#XXX"
  m.elements = {}

  m.onGetMarkUp = function(ele){
    //elements.temp = ele.querySelector('*[template="temp"')
    console.log("not implemented")
  }
  m.dataBind = function(data){
    console.log("not implemented")
  }


  function getMarkup (eleContainer){
    var p=  new Promise(function (resolve, reject) {
      findElementOrLoadInclude(m.querySelectorStr ,m.includePath,eleContainer)
      .then(function(ele){
        resolve(ele)
      })
      .catch(function(err){
        reject(err)
      })
    })
    .then(function(ele){
      m.element = ele;
      m.onGetMarkUp(ele)
      ele.remove()

    })
    .catch(function(err){
      throw err
    })
  }
}
