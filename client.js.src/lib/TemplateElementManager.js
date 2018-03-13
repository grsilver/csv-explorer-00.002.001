import {forEach as forEach}  from './forEach.js';
export {TemplateElementManager as TemplateElementManager};


class TemplateElementManager {

  constructor() {
    this.templateElementRegistrations = []
  }

  forEachTemplateElement(callback){
    forEach(this.templateElementRegistrations,function(reg){
      callback(reg)
    })
  }

  getTemplateInstanceById(id){
    return forEach(this.templateElementRegistrations,function(reg,i,fnBreak){
      if(reg.id == id){
        fnBreak(reg.element.cloneNode(true))
      }
    })
  }

  checkForTemplates (parentElement){
    var me = this
    var elements = parentElement.querySelectorAll("*[template]")
    if(!elements)
      return

    var ele,id
    for(var i = 0; i < elements.length; i++){
      ele = elements[i]

      id = ele.getAttribute("template")
      //console.log("template: "+ id)
      this.templateElementRegistrations.push({
        id:id
        ,element:ele
        ,parentNode: ele.parentNode
      })
      ele.remove();
    }
    return this;
  }

}
