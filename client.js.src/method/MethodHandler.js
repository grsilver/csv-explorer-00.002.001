import _ from 'lodash';
import {log as log} from '../lib/log.js';

import {SubmitHandler as SubmitHandler} from './SubmitHandler.js';

export {MethodHandler as MethodHandler};


function MethodHandler(){
  var t = this;
  t.setElement = setElement
  t.dataBind = dataBind
  t.methodRegistrationData;


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
    t.methodRegistrationData = record
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

    var btnExpandCollapse = eleRecord.querySelector(".method_nameContainer")
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
  /**
   * Returns Description
   * @param {Object} paramObj - Description.
   * @param {string} paramObj.key1 - Description  Key.
   * @param {string} paramObj.key1 - Description  Key.
   * @returns {(number|Array)} Description return
   * http://usejsdoc.org/tags-param.html
   */
  function displayParameterInputs(){
    var container = eleRecord.querySelector(".method_params")

    var count = 0
    _.forEach(t.methodRegistrationData.params,function(param){
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

    var methodParams = {}
    _.forEach(t.methodRegistrationData.params,function(param){
      methodParams[param.name] = param.getValue()
    })

    var submitHandler = new SubmitHandler(t.methodRegistrationData,methodParams)
    submitHandler.submit(methodParams)


  }

}
