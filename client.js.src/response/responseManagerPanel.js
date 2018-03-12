import {findElementOrLoadInclude as findElementOrLoadInclude} from '../lib/findElementOrLoadInclude.js';
import {panelManager as panelManager} from '../panels/panelManager.js';
import {submission_listener_responseHandler_cr8er as submission_listener_responseHandler_cr8er} from './submission_listener_responseHandler_cr8er.js';
import {forEach as forEach}  from '../lib/forEach.js';


var m = {}
export {m as responseManagerPanel};

m.init = init;

var _pnl;
var _templateResponseSummary
var _summary_container
var _responseSummaries = []

function init(){
  return new Promise(function(resolve,reject){
    findElementOrLoadInclude("#response_manager_panel","/includes/responseManager.html")
    .then(function(response_manager_panel){
      _pnl = response_manager_panel
      _summary_container = _pnl.querySelector(".response_manager_response_summary_container")
      _templateResponseSummary = _pnl.querySelector(".response_manager_response_summary")
      _templateResponseSummary.remove()

      submission_listener_responseHandler_cr8er.eventManager.addListener.newResponseHandler(onNewResponseHandler)

      panelManager.registerPanel("Response Manager",_pnl)

      resolve()

    })
    .catch(function(err){
      reject(err)
    })

  })

}


function onNewResponseHandler(evt){
  console.log("onNewResponseHandler")
  var responseHandler = evt.responseHandler
  var eleResponseSummary = _templateResponseSummary.cloneNode(true);
  _summary_container.appendChild(eleResponseSummary)

  var submitHandler = responseHandler.submitHandler

  var eleTimeSubmitted = eleResponseSummary.querySelector("*[data=timeSubmitted]")
  eleTimeSubmitted.innerHTML = new Date(submitHandler.timeSubmitted)


  var eleMethod = eleResponseSummary.querySelector("*[data=method]")
  eleMethod.innerHTML = submitHandler.method

  var eleCompleted= eleResponseSummary.querySelector("*[data=completed]")
  eleCompleted.innerHTML = submitHandler.completed

  var btnShow= eleResponseSummary.querySelector(".response_manager_response_summary_show")
  btnShow.addEventListener("click",function(){
    console.log("response_manager_response_summary_show")
    responseHandler.show()
  });

  var responseSummaryReg = {
    element: eleResponseSummary
    ,responseHandler: responseHandler
  }

  _responseSummaries.push(responseSummaryReg);

  var btnRemove= eleResponseSummary.querySelector(".response_manager_response_summary_remove")
  btnRemove.addEventListener("click",function(){
    removeResponseSummary(responseSummaryReg)
  });

}

function removeResponseSummary(responseSummaryReg){
  var temp = []
  forEach(_responseSummaries,function(reg,count,brk){
    if(reg!=responseSummaryReg){
      temp.push(reg)
    }
  })
  responseSummaryReg.element.remove();
  _responseSummaries = temp;
}
