import _ from 'lodash';
import {log as log} from '../helpers/log.js';
import {apiCallHandler as apiCallHandler} from '../api/apiCallHandler.js';
import {EventManager as EventManager} from '../helpers/EventManager.js';

export {MethodRecord as MethodRecord};


function MethodRecord(){
  var t = this;
  t.setElement = setElement
  t.dataBind = dataBind
  t.dataRecord;
  t.eventManager = new EventManager(t)
    .registerEvent("submit")
    .registerEvent("responseSuccess")
    .registerEvent("responseError")


  var eleRecord
  var eleTemplate_param
  var eleDetails
  var expanded

  function setElement(element){
    eleRecord = element

    eleTemplate_param = eleRecord.querySelector('*[template="method_param"]');
    eleTemplate_param.remove();
    eleDetails = eleRecord.querySelector('.method_details');
    return t
  }
  function dataBind(record){
    t.dataRecord = record
    var aryFieldElements = eleRecord.querySelectorAll('*[data]');

    _.forEach(aryFieldElements,function(eleField){
      var fieldName = eleField.getAttribute("data")
      if(record[fieldName]){
        eleField.innerHTML = record[fieldName]
      }
      else{
        eleField.innerHTML = "no data for: "+ fieldName
      }

    })
    displayParameterInputs()
    var method_submit_container = eleRecord.querySelector(".method_submit_container")
    var btnSubmit = method_submit_container.querySelector("span")
    btnSubmit.addEventListener("click",submit);

    var btnExpandCollapse = eleRecord.querySelector(".method_nameContainer").querySelector("span")
    btnExpandCollapse.addEventListener("click",function(){
      if(expanded){
        collapse()
      }
      else {
        expand()
      }
    });
    collapse();
    return t
  }
  function displayParameterInputs(){
    var container = eleRecord.querySelector(".method_params")

    var count = 0
    _.forEach(t.dataRecord.params,function(param){
      count ++
      var eleParam = eleTemplate_param.cloneNode(true);
      container.appendChild(eleParam);
      eleParam.querySelector('*[data="name"]').innerHTML = param.name;
      var input = eleParam.querySelector('input')
      input.value = param.defaultValue
      param.getValue = function(){
        return input.value
      }
    })
    if(count== 0)
      container.remove()
  }
  function expand(){
    expanded = true
    eleRecord.appendChild(eleDetails)
  }
  function collapse(){
    expanded = false;
    eleDetails.remove()
  }
  function submit(){


    //log("submit")

    var methodParams = {}
    _.forEach(t.dataRecord.params,function(param){
      methodParams[param.name] = param.getValue()
    })

    t.eventManager.broadcast.submit({
      methodRecord:t
      ,method: t.dataRecord.requestPath
      ,params:methodParams
      ,methodRegistrationData: t.dataRecord
    })

    apiCallHandler.call(t.dataRecord.requestPath,methodParams).then(function(objResp){
      t.eventManager.broadcast.responseSuccess({
        methodRecord:t
        ,metaResponse:objResp
        ,response: objResp.response
        ,method: t.dataRecord.requestPath
        ,params:methodParams
        ,methodRegistrationData: t.dataRecord
      })

    })
    .catch(function (err) {
      t.eventManager.broadcast.responseError({
        methodRecord:t
        ,error: err
        ,method: t.dataRecord.requestPath
        ,params:methodParams
        ,methodRegistrationData: t.dataRecord
      })

    })

  }

}
