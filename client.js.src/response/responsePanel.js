import {findElementOrLoadInclude as findElementOrLoadInclude} from '../lib/findElementOrLoadInclude.js';
import {panelManager as panelManager} from '../panels/panelManager.js';
import {forEach as forEach}  from '../lib/forEach.js';
import {SubmitHandler as SubmitHandler} from '../method/SubmitHandler.js';
import {ResponseHandler_WithDataMarkUps as ResponseHandler_WithDataMarkUps} from './ResponseHandler_WithDataMarkUps.js';


var m = {}
export {m as responsePanel};

m.init = init;

var _pnl;
var _templateResponseSummary
var _summaries_container
var _responseSummaries = []

function init(){

  return new Promise(function(resolve,reject){


    findElementOrLoadInclude("#response_panel","/includes/response_panel.html")
    .then(function(response_panel){
      _pnl = response_panel
      _summaries_container = _pnl.querySelector("#response_panel_summaries")
      _templateResponseSummary = _pnl.querySelector(".response_panel_summary")
      
      _templateResponseSummary.remove()

      SubmitHandler.eventManager.addListener.newSubmission(onNewSubmission)

      panelManager.registerPanel("Response Manager",_pnl)

      resolve()

    })
    .catch(function(err){
      reject(err)
    })

  })

}


function onNewSubmission(evt){

  //console.log("onNewSubmission")

  var submitHandler = evt.submitHandler
  var responseHandler = new ResponseHandler_WithDataMarkUps(submitHandler)




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
    //console.log("response_panel_response_summary_show")
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
