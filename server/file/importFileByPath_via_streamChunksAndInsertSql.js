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
const ReadWriteStreamHandler = require('../lib/ReadWriteStreamHandler.js')
const jobManager = require('../lib/jobManager.js')

module.exports = importFileByPath_via_streamChunksAndInsertSql;

//insert method: msecsElapsed:    218542  (3.64 min)
//load data method: msecsElapsed: 204534  (3.4)

const ssdLineDeliminator = "\n"
var holderJobInfo = {}

function importFileByPath_via_streamChunksAndInsertSql(paramObj){
  return new Promise((resolve,reject)=>{
    importFileByPath_sub(paramObj,resolve,reject)
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

  //log('importFileByPath_sub')

  // replyObj
  var jobInfo = jobManager.getNewJob({fnTerminate:terminate,jobType:"importFileByPath_via_streamChunksAndInsertSql"})
  //jobInfo.tableExisted= false
  jobInfo.chunkCount = 0
  jobInfo.lineCount = 0
  jobInfo.insertedChunkCount = 0
  jobInfo.forcedTermination = false
  jobInfo.cleanedUp = false  //
  jobInfo.insertErrorLimitReached  =  false  //
  jobInfo.aryFieldInfo =  null
  jobInfo.repliedWithIncompleteJob = false



  //var readDone = false // set in onReadStreamClose()
  var readWriteStreamHandler// set in nested getQueryHandler.then()
  var leftOverFromLastChunk; // set in nested function trim_store_and_carryOver_last_incomplete_line()
  var queryHandler;// set in getQueryHandler().then()
  var mSecsTimeOut_replyWithIncompleteJob = 3000
  var replied = false
  var fieldNames  = null; // set in processFirstChunk, used in getSql2InsertChunk
  var tblCreated = false

  paramObj.filePath = ssd_file_utils.normalizeFilePath(paramObj.filePath)

  // frist get a db connection wrapped in a promise (queryHandler), then start to read / insert (cr8ReadWritePipe)
  getQueryHandler()
  .then(function(qHandler){
    queryHandler = qHandler
    readWriteStreamHandler = new ReadWriteStreamHandler()
    readWriteStreamHandler
      .addListener_chunkReady2Write(onWriteStreamChunk)
      .setFilePath(paramObj.filePath)
      .allowLog(false,"importFileByPath")
      .begin() // creates read and write streams and starts the pipe
      .then(function(arg1){
        log("readWriteStreamHandler done: "+ arg1)
        terminate(false,"readWriteStreamHandler done");
      })
      .catch(function(err){
        jobInfo.logError(err)
        terminate(true,"erro on readWrite")
      })
  })
  .catch(reject)

  function terminate(forcedTermination,msg){
    if(jobInfo.completed)
      return
    log("terminate: "+ msg)
    jobInfo.forcedTermination = forcedTermination
    jobInfo.terminateMsg = msg
    jobInfo.setComplete()
    jobInfo.updateTimeElasped()
    cleanUp();
    reply();
  }
  function reply(){
    if(replied)
      return
    replied = true
    log("replying with jobInfo of ongoing job: "+ jobInfo.jobID)
    resolve(jobInfo)
  }
  function cleanUp(){
    if(jobInfo.cleanedUp)
      return
    log("cleanUp");
    jobInfo.cleanedUp = true
    queryHandler.end()
    readWriteStreamHandler.close();
    queryHandler = null;
    readWriteStreamHandler = null;
  }
  function onWriteStreamChunk(chunk,encoding,callback_writeChunkDone){


    if(jobInfo.cleanedUp)
      return
    jobInfo.chunkCount++
    //log("onWriteStreamChunk: "+ jobInfo.chunkCount)
    jobInfo.updateTimeElasped()

    if(jobInfo.msecsElapsed >= mSecsTimeOut_replyWithIncompleteJob){
      jobInfo.repliedWithIncompleteJob = true;
      reply()
    }
    var strChunk = chunk.toString()
    checkTblCreated(strChunk)
    .then(function(possiblyModifiedChunk){
      return insertChunk(possiblyModifiedChunk)
    })
    .then(function(){
      callback_writeChunkDone()
    })
    .catch(function(err){
      log("onWriteStreamChunk: err: "+ err)
      jobInfo.errorCount++;
      jobInfo.lastError = err
      if(jobInfo.chunkCount == 1){
        log("-error on 1st chunk, breaking")
        terminate(true,"error on 1st chunk")
      }
      else if(jobInfo.errorCount >= paramObj.insertErrorLimit){
        jobInfo.insertErrorLimitReached = true
        terminate(true,"too many errors")
      }
      else{
        callback_writeChunkDone()
      }
    })
  }
  function checkTblCreated(strChunk){
    return new Promise(function(resolve,reject){
      if(tblCreated){
        resolve(strChunk)
        return
      }
      log("cr8Tbl")
      ssd_file_utils.cr8TableForImportFrom1stChunk(paramObj.tblName,queryHandler,strChunk)
      .then(function(obj){
        tblCreated = true
        var modifiedChunk = obj.remainingChunk
        jobInfo.aryFieldInfo =  obj.aryFieldInfo
        fieldNames = obj.fieldNamesStr
        resolve(modifiedChunk)
      })
      .catch(reject)
    })
  }
  //insert write stream chunk into database
  function insertChunk(strChunk){
    return new Promise((resolve,reject)=>{
      strChunk = trim_store_and_carryOver_last_incomplete_line(strChunk);
      jobInfo.lineCount += strChunk.match(/\n/g).length;
      var sql = getSql2InsertChunk(strChunk)
      //log("\n-chunk #: "+jobInfo.chunkCount)//+". sql: \n"+sql)
      queryHandler(sql)
      .then(function(rows){
        jobInfo.insertedChunkCount++
        //log("\n-query success!, insertedChunkCount: "+ jobInfo.insertedChunkCount)
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
}
