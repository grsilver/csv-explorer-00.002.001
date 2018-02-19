import _ from 'lodash';
import {log as log} from '../helpers/log.js';
import {apiCallHandler as apiCallHandler} from '../api/apiCallHandler.js';

export {MethodRecord as MethodRecord};


function MethodRecord(){
  var t = this;
  t.setElement = setElement
  t.dataBind = dataBind
  var eleRecord
  var dataRecord
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
    dataRecord = record
    var aryFieldElements = eleRecord.querySelectorAll('*[data]');

    _.forEach(aryFieldElements,function(eleField){
      var fieldName = eleField.getAttribute("data")
      if(dataRecord[fieldName]){
        eleField.innerHTML = dataRecord[fieldName]
      }
      else{
        eleField.innerHTML = "no data for: "+ fieldName
      }

    })
    _.forEach(record.params,function(param){

      var eleParam = eleTemplate_param.cloneNode(true);
      eleRecord.querySelector(".method_params").appendChild(eleParam);

      eleParam.querySelector('*[data="name"]').innerHTML = param.name;
      var input = eleParam.querySelector('input')
      input.value = param.defaultValue
      param.getValue = function(){
        return input.value
      }
    })

    var btnSubmit = eleRecord.querySelector(".method_submit_container").querySelector("span")
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
  function expand(){
    expanded = true
    eleRecord.appendChild(eleDetails)
  }
  function collapse(){
    expanded = false;
    eleDetails.remove()
  }
  function submit(){

    log("submit")

    var paramsExport = {}
    _.forEach(dataRecord.params,function(param){
      paramsExport[param.name] = param.getValue()
    })
    apiCallHandler.call(dataRecord.requestPath,paramsExport,function(success, objResp){
      debugger
    })
  }



}
