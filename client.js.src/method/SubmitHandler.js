import {apiCallHandler as apiCallHandler} from '../api/apiCallHandler.js';
import {EventManager as EventManager} from '../lib/EventManager.js';

export {SubmitHandler as SubmitHandler};


SubmitHandler.eventManager = new EventManager(SubmitHandler).registerEvent("newSubmission")



function SubmitHandler(methodRegistrationData){
  var t = this;
  t.methodRegistrationData = methodRegistrationData
  t.method = t.methodRegistrationData.requestPath
  t.timeSubmitted = null;
  t.timeElasped = null;
  t.completed = false
  t.successful = false
  t.error = null
  t.metaResponse = null
  t.response = null
  t.methodParams = null;
  t.submit = submit
  t.eventManager = new EventManager(t).registerEvent("responseError").registerEvent("responseSuccess").registerEvent("complete")


  function submit(methodParams){

    t.timeSubmitted = Date.now()
    t.methodParams = methodParams

    SubmitHandler.eventManager.dispatch.newSubmission({
      submitHandler:t
    })


    apiCallHandler.call(t.methodRegistrationData.requestPath,methodParams)
    .then(function(objResp){
      t.metaResponse = objResp
      t.response = objResp.response
      onComplete(true)

      t.eventManager.dispatch.responseSuccess({
        submitHandler:t
      })

    })
    .catch(function (err) {
      t.error  = err
      onComplete(false)

      t.eventManager.dispatch.responseError({
        submitHandler:t
      })

    })
  }

  function onComplete(success){
    //console.log("onComplete")
    t.timeElasped = Date.now() - t.timeSubmitted
    t.completed = true
    t.successful = success
    t.eventManager.dispatch.complete({
      submitHandler:t
      ,success: success
    })
  }

}
