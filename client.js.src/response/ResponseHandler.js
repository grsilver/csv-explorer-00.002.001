
import {findElementOrLoadInclude as findElementOrLoadInclude} from '../lib/findElementOrLoadInclude.js';
import {forEach as forEach} from '../lib/forEach.js';
import {panelManager as panelManager} from '../panels/panelManager.js';
import {matchElementsWithData as matchElementsWithData} from '../lib/matchElementsWithData.js';


export {ResponseHandler as ResponseHandler};


class ResponseHandler{

  constructor(submitHandler) {
    //console.log("new ResponseHandler created")
    var t = this
    t.submitHandler = submitHandler
    t.element = null
    submitHandler.eventManager.addListener.complete(function(){
      //console.log("ResponseHandler: submitHandler.eventManager.addListener.complete")
      t._onSubmitComplete()
    })

    t.querySelectorStr = ".response_handler"
    t.includePath = "/includes/responseHandler.html"

  }

 _onSubmitComplete(evt){
   var t = this;
   if(t.element){
     t._displayComplete()
   }
   t.show()
 }

 show(){
   var t = this
   t._aquireMarkup().then(function(){t._showPanel()})
 }

 _showPanel(){
   panelManager.showPanel(this.element)
 }

 _displayComplete(){
   var t = this;
   var response_handler_submission = t.element.querySelector(".response_handler_submission")


   var submissionData = {
      method:t.submitHandler.method
     ,timeSubmitted: new Date(t.submitHandler.timeSubmitted).toString()
     ,error: t.submitHandler.error ? "yes" : "no"
     ,completed: t.submitHandler.completed ? "yes" : "no"
   }
   if(t.submitHandler.timeElasped){
     submissionData.timeElasped = t.submitHandler.timeElasped;
   }

   matchElementsWithData(response_handler_submission,submissionData)


   var response_container = t.element.querySelector(".response_handler_response_container");
   if(t.submitHandler.error){
     response_container.innerHTML = JSON.stringify(t.submitHandler.error)
   }
   else{
     response_container.innerHTML = JSON.stringify(t.submitHandler.response)
   }
 }

 _onAquire(templateEle){
   var t = this
   return new Promise(function(resolve, reject){
     t.element = templateEle.cloneNode(true);

     var paramTemplate = t.element.querySelector(".response_handler_submission_param")
     paramTemplate.remove()
     var paramsContainer = t.element.querySelector(".response_handler_submission_params")
     forEach(t.submitHandler.methodParams,function(val,key){
       var eleParam = paramTemplate.cloneNode(true)
       paramsContainer.appendChild(eleParam)
       eleParam.querySelector("*[data=key]").innerHTML = key;
       eleParam.querySelector("*[data=value]").innerHTML = val;
     })




     var response_handler_submission = t.element.querySelector(".response_handler_submission")


     var submissionData = {
        method:t.submitHandler.method
       ,timeSubmitted: new Date(t.submitHandler.timeSubmitted).toString()
       ,error: t.submitHandler.error ? "yes" : "no"
       ,completed: t.submitHandler.completed ? "yes" : "no"
     }

     matchElementsWithData(response_handler_submission,submissionData);




     if(t.submitHandler.completed){
       try{
         t._displayComplete()
       }
       catch(err){
         reject(err)
       }

     }

     resolve()
   })
 }

 _aquireMarkup (){
    var t = this;
    return new Promise (function (resolve, reject) {

      if(t.element){
        resolve()
        return
      }

      findElementOrLoadInclude(t.querySelectorStr ,t.includePath)
      .then(function(templateEle){
        return t._onAquire (templateEle)
      })
      .then(function(){
        resolve()
      })
      .catch(function(err){
        //var err2 = new Error("ResponseHandler: Can't aquire markup");
        //err2.innerError = err
        throw err
      })
    })
  }


}
