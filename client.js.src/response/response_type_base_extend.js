import {findElementOrLoadInclude as findElementOrLoadInclude} from '../helpers/findElementOrLoadInclude.js';
import _ from 'lodash';
export {response_type_base_extend as response_type_base_extend};

function response_type_base_extend(m){

  m.getMarkup = getMarkup
  m.includePath = "/includes/response_panel.html"
  m.querySelectorStr = "#XXX"
  m.elements = {}
  m.element = null

  m.onGetMarkUp = function(ele){
    //elements.temp = ele.querySelector('*[template="temp"')
    console.log("not implemented")
  }
  m.dataBind = function(data){
    console.log("not implemented")
  }
  m.getTemplateAndDataBind = function (templateName,dataRecord){
    // todo
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
      findTemplates(ele)
      m.onGetMarkUp(ele)
      ele.remove()

    })
    .catch(function(err){
      throw err
    })
  }
  function findTemplates(ele){
    var ary = ele.querySelectorAll("*[template]")
    _.forEach(ary,function(eleTemplate){
      var templateName = eleTemplate.getAttribute("template");
      m.elements[templateName] = eleTemplate
      eleTemplate.remove()
    })
  }
}
