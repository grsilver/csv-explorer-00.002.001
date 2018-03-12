import {forEach as forEach}  from '../lib/forEach.js';
import {DataMarkup as DataMarkup} from '../lib/DataMarkup.js';
import {matchElementsWithData as matchElementsWithData} from '../lib/matchElementsWithData.js';
import {TemplateElementManager as TemplateElementManager} from '../lib/TemplateElementManager.js';

export {Response_DataMarkup_Object as Response_DataMarkup_Object};

class Response_DataMarkup_Object extends DataMarkup {

  constructor() {
    super()
    this.includePath = "/includes/response_panel.html"
    this.querySelectorStr = "#response_object"
  }

  onAquireMarkup(ele){
    super.onAquireMarkup(ele)
    this.templateElementManager = new TemplateElementManager().checkForTemplates(ele)
  }

  remove(){
    super.remove()
    this.element.innerHTML = ""
  }

  dataBind (data){
    super.dataBind(data)

    var templateElementManager = this.templateElementManager


    iterate(this.element,data)

    function iterate(childrenContainer,dataScope){
      var isObject
      forEach(dataScope,function(value,key){
        var itemElement;
        isObject = false
        if(value && typeof(value) == "object"){
          isObject = true
          itemElement = templateElementManager.getTemplateInstanceById("response_object_child_object")
        }
        else{
          itemElement = templateElementManager.getTemplateInstanceById("response_object_item");
        }

        childrenContainer.appendChild(itemElement)
        matchElementsWithData(itemElement,{value:value,key:key})

        if(isObject){
          var grandChildrenContainer = itemElement.querySelector(".response_object_child_object_grandchildren");

          var eleKey = itemElement.querySelector(".response_object_child_object_key_bar")
          var expanded = false
          var boundGrandChildren = false
          eleKey.addEventListener("click",function(){
            expanded?collapse():expand();
          });
          collapse()
          function collapse(){
            expanded = false
            grandChildrenContainer.remove()
          }
          function expand(){
            expanded = true
            itemElement.appendChild(grandChildrenContainer)
            if(boundGrandChildren)
              return
            boundGrandChildren = true;
            iterate(grandChildrenContainer,value)
          }



        }



      })
    }//iterate

  }

}
