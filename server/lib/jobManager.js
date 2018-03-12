const forEach = require ('../lib/forEach.js');


var jobManager = {}
module.exports = jobManager;

jobManager.getNewJob = getNewJob
jobManager.terminateJobByID = terminateJobByID
jobManager.getJobInfoByID = getJobInfoByID

var holder = {}
function getNewJob(){
    var jobInfo = {
        jobID: "job_"+ Date.now()
      , msecsElapsed: 0
      , isServerJobInfo: true
      , jobType: null
      , startTime:Date.now()
      , complete: false
      , errorCount: 0
      , method2CheckJobStatus : "getJobInfoByID"
      , terminateJobByID : "terminateJobByID"
    }
    jobInfo.setTerminateFunction = function(fn){
      jobInfo.terminate = fn
      return jobInfo
    }
    jobInfo.setJobType = function(strType){
      jobInfo.jobType = strType
      return jobInfo
    }
    jobInfo.updateTimeElasped = function(){
      jobInfo.msecsElapsed = Date.now()-jobInfo.startTime
      return jobInfo
    }
    jobInfo.setComplete = function (){
      jobInfo.complete = true
      return jobInfo
    }
    jobInfo.logError = function (err){
      jobInfo.errorCount++
      jobInfo.lastError = err
      return jobInfo
    }

    holder[jobInfo.jobID] = jobInfo
    return jobInfo
}

function terminateJobByID(paramObj){
  return new Promise((resolve,reject)=>{
    var jobInfo = holder[paramObj.jobID]
    if(jobInfo){
      jobInfo.terminate(true,"called by terminateJobByID")
      resolve(jobInfo);
    }
    else{
      var err = new Error("getJobInfoByID: no jobInfo with ID: "+ paramObj.jobID)
      reject(err)
    }
  })
}

function getJobInfoByID(paramObj){
  return new Promise((resolve,reject)=>{
    var jobInfo = holder[paramObj.jobID]
    if(jobInfo){

      var obj = {}
      forEach(jobInfo,function(val,key){
        if(key== "terminate") return
        if(key== "setComplete") return
        if(key== "updateTimeElasped") return
        if(key== "logError") return
        if(key== "setJobType") return
        if(key== "setTerminateFunction") return
        obj[key] = val
      })

      resolve(obj)
    }
    else{
      var err = new Error("getJobInfoByID: no jobInfo with ID: "+ paramObj.jobID)
      reject(err)
    }
  })
}
