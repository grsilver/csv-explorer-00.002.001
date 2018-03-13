
import {findElementOrLoadInclude as findElementOrLoadInclude} from '../lib/findElementOrLoadInclude.js';
import {panelManager as panelManager} from '../panels/panelManager.js';


export {ResponseHandler as ResponseHandler};


class ResponseHandler{

  constructor(submitHandler) {
    console.log("new ResponseHandler created")
    var t = this
    t.submitHandler = submitHandler
    t.element = null
    submitHandler.eventManager.addListener.complete(function(){
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
   var eleCompleted = t.element.querySelector("*[data=completed]")
   eleCompleted.innerHTML = t.submitHandler.completed


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

     t.paramTemplate = t.element.querySelector(".response_handler_submission_param")
     t.paramTemplate.remove()


     var filePath = t.element.querySelector("*[data=filePath]")
     filePath.innerHTML = t.submitHandler.method

     var timeSubmitted = t.element.querySelector("*[data=timeSubmitted]")
     var dtTimeSubmitted = new Date(t.submitHandler.timeSubmitted)
     timeSubmitted.innerHTML = dtTimeSubmitted.toString();

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
        var err2 = new Error("ResponseHandler: Can't aquire markup");
        err2.innerError = err
        throw err2
      })
    })
  }


}
