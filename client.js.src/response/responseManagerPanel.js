import {findElementOrLoadInclude as findElementOrLoadInclude} from '../lib/findElementOrLoadInclude.js';
import {panelManager as panelManager} from '../panels/panelManager.js';
import {submission_listener_responseHandler_cr8er as submission_listener_responseHandler_cr8er} from './submission_listener_responseHandler_cr8er.js';
import {forEach as forEach}  from '../lib/forEach.js';


var m = {}
export {m as responseManagerPanel};

m.init = init;

var _pnl;
var _templateResponseSummary
var _summaries_container
var _responseSummaries = []

function init(){
  return new Promise(function(resolve,reject){
    findElementOrLoadInclude("#response_manager_panel","/includes/responseManagerPanel.html")
    .then(function(response_manager_panel){
      _pnl = response_manager_panel
      _summaries_container = _pnl.querySelector("#response_manager_summaries")
      _templateResponseSummary = _pnl.querySelector(".response_manager_summary")
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
  //console.log("onNewResponseHandler")
  var responseHandler = evt.responseHandler
  var eleResponseSummary = _templateResponseSummary.cloneNode(true);
  _summaries_container.appendChild(eleResponseSummary)

  var submitHandler = responseHandler.submitHandler

  var eleTimeSubmitted = eleResponseSummary.querySelector("*[data=timeSubmitted]")
  eleTimeSubmitted.innerHTML = new Date(submitHandler.timeSubmitted)


  var eleMethod = eleResponseSummary.querySelector("*[data=method]")
  eleMethod.innerHTML = submitHandler.method

  var eleCompleted= eleResponseSummary.querySelector("*[data=completed]")
  eleCompleted.innerHTML = submitHandler.completed

  var btnShow= eleResponseSummary.querySelector("*[template_id=btnshow]")
  btnShow.addEventListener("click",function(){
    //console.log("response_manager_response_summary_show")
    responseHandler.show()
  });

  var responseSummaryReg = {
    element: eleResponseSummary
    ,responseHandler: responseHandler
  }


  submitHandler.eventManager.addListener.complete(function(evt){
    //console.log("responseManagerPanel: submitHandler.eventManager.addListener.complete")
    if(evt.success){
      eleCompleted.innerHTML = "success"
    }
    else{
      eleCompleted.innerHTML = "failed"
    }
  })

  _responseSummaries.push(responseSummaryReg);

  var btnRemove= eleResponseSummary.querySelector("*[template_id=btnremove]")
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
