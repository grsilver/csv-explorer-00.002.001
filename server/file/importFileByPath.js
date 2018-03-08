const ssd_file_utils = require("./ssd_file_utils.js")
const forEach = require ('../lib/forEach.js');
var fs = require('fs');
var util = require('util');
const { Readable } = require('stream');//var Readable = require('stream').Readable;
const { Transform } = require('stream');
const { Writable } = require('stream');
const getQueryHandler = require('../db/getQueryHandler.js');
const checkIfTableExists =  require('../db/checkIfTableExists.js');
const cr8Table = require('../db/cr8Table.js')

module.exports = importFileByPath;
importFileByPath.getJobInfoByID = getJobInfoByID;
importFileByPath.terminateJobByID = terminateJobByID;


const ssdLineDeliminator = "\n"
var holderJobInfo = {}

function importFileByPath(paramObj){
  return new Promise((resolve,reject)=>{
    importFileByPath_sub(paramObj,resolve,reject)
  })
}
function getJobInfoByID(paramObj){
  return new Promise((resolve,reject)=>{
    var jobInfo = holderJobInfo[paramObj.jobID]
    if(jobInfo){
      resolve(jobInfo)
    }
    else{
      var err = new Error("getJobInfoByID: no jobInfo with ID: "+ paramObj.jobID)
      reject(err)
    }
  })
}
function terminateJobByID(paramObj){
  return new Promise((resolve,reject)=>{
    var jobInfo = holderJobInfo[paramObj.jobID]
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
function importFileByPath_sub(paramObj,resolve,reject){
  //paramObj.checkStatusByID = "[statusID]"
  //paramObj.filePath = "Book1.csv"
  //paramObj.filePath = "copy.copy.csv"
  //paramObj.filePath = "DailySessionLog_BellMedia_2018-01-17.csv"
  //paramObj.tblName;

  paramObj.insertErrorLimit =  paramObj.insertErrorLimit || 6
  // -----------------------------TEMP
  paramObj.allowLog = true;
  //paramObj.chunkLimit = 5
  // -----------------------------TEMP

  log('importFileByPath_sub')

  // replyObj
  var jobInfo = {
    jobID: "job_"+ Date.now()
    ,completed : false  //
    ,chunkCount:0
    ,insertedCount:0
    ,errorCount:0
    ,msecsElapsed: 0
    ,isServerJobInfo:true
    ,method2CheckJobStatus : "file.importFileByPath.getJobInfoByID"
    ,terminateJobByID : "file.importFileByPath.terminateJobByID"
    ,tableExisted: false
    ,forcedTermination : false
    ,chunkLimitReached: false
    ,startTime:Date.now()
    ,cleanedUp : false  //
    ,insertErrorLimitReached : false  //
    ,lastError : false
    ,aryFieldInfo: null
    ,repliedWithIncompleteJob:false
    ,terminate : terminate  //
  }

  holderJobInfo[jobInfo.jobID] = jobInfo;


  //var readDone = false // set in onReadStreamClose()
  var rstream,wstream // set in nested function cr8ReadWritePipe()
  var leftOverFromLastChunk; // set in nested function trim_store_and_carryOver_last_incomplete_line()
  var queryHandler;// set in getQueryHandler().then()
  var mSecsTimeOut_replyWithIncompleteJob = 3000
  var replied = false
  var fieldNames  = null; // set in processFirstChunk, used in getSql2InsertChunk

  paramObj.filePath = ssd_file_utils.normalizeFilePath(paramObj.filePath)

  // frist get a db connection wrapped in a promise (queryHandler), then start to read / insert (cr8ReadWritePipe)
  getQueryHandler()
  .then(function(qHandler){
    queryHandler = qHandler
    cr8ReadWritePipe()
  })
  .catch(function(err){
    reject(err)
  })
  // creates read and write streams and starts the pipe
  function cr8ReadWritePipe(){
    log('cr8ReadWritePipe')
    rstream = fs.createReadStream(paramObj.filePath );
    wstream = new Writable({
      write(chunk, encoding, callback_writeChunkDone) {
        onWriteStreamChunk(chunk,callback_writeChunkDone)
      }
    });
    wstream.on('finish', onWriteStreamFinish);
    rstream.on('close', onReadStreamClose);
    rstream.pipe(wstream);
  }
  //bound in cr8ReadWritePipe(); rstream.on('close', onReadStreamClose); gets called when all reading is done. usually before write stream is done
  function onReadStreamClose(){
    //readDone = true
    log("rstream close")
  }
  // bound in cr8ReadWritePipe(); wstream.on('finish', onWriteStreamFinish); gets called when wstream.end() is called or when pipe finishes
  function onWriteStreamFinish(arg1){
    log("wstream finish: "+ arg1)
    terminate(false,"wstream finish");
  }
  function terminate(forcedTermination,msg){
    if(jobInfo.completed)
      return
    log("terminate: "+ msg)
    jobInfo.forcedTermination = forcedTermination
    jobInfo.terminateMsg = msg
    jobInfo.completed = true;
    updateElapsedTime()
    cleanUp();
    reply();
  }
  function reply(){
    if(replied)
      return
    replied = true
    log("replying with jobInfo of ongoing job")
    resolve(jobInfo)
  }
  function cleanUp(){
    if(jobInfo.cleanedUp)
      return
    log("cleanUp");
    jobInfo.cleanedUp = true
    queryHandler.end()
    try{
      rstream.close()
    }
    catch(err){
      log("cleanUp: can't close rstream")
    }
    try{
      wstream.end()
    }
    catch(err){
      log("cleanUp: can't end wstream")
    }
    queryHandler = null;
    rstream = null;
    wstream = null;

  }
  function onWriteStreamChunk(chunk,callback_writeChunkDone){
    //rstream.pause();
    //rstream.resume()
    if(jobInfo.cleanedUp)
      return
    jobInfo.chunkCount++
    updateElapsedTime()

    if(jobInfo.msecsElapsed >= mSecsTimeOut_replyWithIncompleteJob){
      jobInfo.repliedWithIncompleteJob = true;
      reply()
    }
    var strChunk = chunk.toString()
    if(jobInfo.chunkCount == 1){
      processFirstChunk(strChunk)
      .then(()=>{
        callback_writeChunkDone()
      })
      .catch((err)=>{
        jobInfo.errorCount++;
        jobInfo.lastError = err
        log("-error on 1st chunk, breaking")
        terminate(true,"error on 1st chunk") // envokes wstream.on('finish'
      });
      return
    }
    insertChunk(strChunk)
    .then(()=>{ // insert successful, decide to call next chunk
      if(paramObj.chunkLimit && jobInfo.chunkCount >= paramObj.chunkLimit ){
        jobInfo.chunkLimitReached = true
        log("-limit reach")
        terminate(true,"chunk limit reached")
        //wstream.end("limit reached") // envokes wstream.on('finish'
      }
      else{
        callback_writeChunkDone()
      }
    })
    .catch((err)=>{
      log(err)
      jobInfo.errorCount++;
      jobInfo.lastError = err
      if(jobInfo.errorCount >= paramObj.insertErrorLimit){
        jobInfo.insertErrorLimitReached = true
        terminate(true,"too many errors")
      }
      else{
        callback_writeChunkDone()
      }

    });
  }
  // creates table if needed, sets fieldNames for later use and then calls insertChunk
  function processFirstChunk(strChunk){
    return new Promise((resolve,reject)=>{
      var iLineBrk = strChunk.indexOf("\n")
      // set fieldNames which is declared at a higher scope for multi function reference
      var headerLine = strChunk.substring(0,iLineBrk);

      // cr8 table if doesn't exist
      jobInfo.aryFieldInfo = ssd_file_utils.parseHeaderLine(headerLine)
      fieldNames = jobInfo.aryFieldInfo.map(function(fieldInfo) { return fieldInfo.name;}).toString();

      cr8Table({
        queryHandler:queryHandler
        ,tblName:paramObj.tblName
        ,primaryKey:ssd_file_utils.getPrimaryKey()
        ,aryFieldInfo:jobInfo.aryFieldInfo
        ,ignoreIfExists:true
      })
      .then(()=>{ // table existed or has been created, insert rest of chunk
          strChunk = strChunk.substring(iLineBrk+1);
          insertChunk(strChunk)
          .then(resolve)
          .catch(reject)
      })
      .catch(reject)
    })
  }
  //insert write stream chunk into database
  function insertChunk(strChunk){
    return new Promise((resolve,reject)=>{
      strChunk = trim_store_and_carryOver_last_incomplete_line(strChunk);
      var sql = getSql2InsertChunk(strChunk)
      //log("\n-chunk #: "+jobInfo.chunkCount)//+". sql: \n"+sql)
      queryHandler(sql)
      .then(function(rows){
        jobInfo.insertedCount++
        //log("\n-query success!, insertedCount: "+ jobInfo.insertedCount)
        resolve()
      })
      .catch(reject)
    })
  }
  function getSql2InsertChunk(strChunk){
    /*
    `INSERT INTO ${paramObj.tblName}
    (${fieldNames})
    VALUES
    (1,2,3),
    (4,5,6),
    (7,8,9);`

    */
    var values = strChunk
    values = values.replace(/"\n/g,'")\n,(')
    values = "("+values
    values = values.substring(0,values.length - 3) // take off last ")"
    var sql = `INSERT INTO ${paramObj.tblName}
    (${fieldNames})
    VALUES
    ${values};`
    return sql
  }
  // sometimes the chunk breaks off with an incomplete line, we must save it and carry it over for the next chunk
  function trim_store_and_carryOver_last_incomplete_line(strChunk){
    leftOverFromLastChunk = leftOverFromLastChunk || ""
    strChunk = leftOverFromLastChunk + strChunk;
    leftOverFromLastChunk = "";
    if(strChunk.endsWith("\n"))
      return strChunk;
    var iLineBrk = strChunk.lastIndexOf("\n")
    leftOverFromLastChunk = strChunk.substring(iLineBrk+1);
    strChunk = strChunk.substring(0,iLineBrk+1);
    return strChunk;
  }
  function log(str){
    if(paramObj.allowLog)
      console.log("importFileByPath: " + str)
  }
  function updateElapsedTime(){
        jobInfo.msecsElapsed = Date.now()-jobInfo.startTime
  }
}
