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

module.exports = importFileByPath_via_LoadDataLocalInFile;


//insert method: msecsElapsed:    218542
//load data method: msecsElapsed: 204534

/* how to get status: http://www.stephenchu.com/2008/12/speed-up-your-mysql-data-load.html
use the SHOW INNODB STATUS command.
Find the line that says "undo log entries" under section TRANSACTIONS,
and that number is the number of rows inserted so far.
You can also look at how many inserts were performed per second by finding the line
"inserts/s" under the ROW OPERATIONS section.x
*/


const ssdLineDeliminator = "\n"
var holderJobInfo = {}

function importFileByPath_via_LoadDataLocalInFile(paramObj){
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

  log('importFileByPath_sub')

  // replyObj
  var jobInfo = jobManager.getNewJob({fnTerminate:terminate,jobType:"importFileByPath_via_LoadDataLocalInFile"})

  //jobInfo.tableExisted= false
  jobInfo.forcedTermination = false
  jobInfo.cleanedUp = false  //
  jobInfo.aryFieldInfo =  null
  jobInfo.repliedWithIncompleteJob = false

  //var readDone = false // set in onReadStreamClose()
  var readWriteStreamHandler// set in nested getQueryHandler.then()
  var leftOverFromLastChunk; // set in nested function trim_store_and_carryOver_last_incomplete_line()
  var queryHandler;// set in getQueryHandler().then()
  var mSecsTimeOut_replyWithIncompleteJob = 3000
  var replied = false
  var fieldNames  = null; // set in processFirstChunk, used in getSql2InsertChunk

  paramObj.filePath = ssd_file_utils.normalizeFilePath(paramObj.filePath)

  // frist get a db connection wrapped in a promise (queryHandler), then start to read / insert (cr8ReadWritePipe)
  getQueryHandler()
  .then(function(qHandler){ // db connection created, read file for 1st line
    log('getQueryHandler done')
    queryHandler = qHandler
    readWriteStreamHandler = new ReadWriteStreamHandler()
    return readWriteStreamHandler
      .setChunkLimit(1)
      .setFilePath(paramObj.filePath)
      .allowLog(true,"importFileByPath")
      .begin() // returns a promise creates read and write streams and starts the pipe
  })
  .then(function(obj){ // cr8Table
    log("readWriteStreamHandler done")
    return ssd_file_utils.cr8TableForImportFrom1stChunk(paramObj.tblName,queryHandler,obj.lastChunk)
  })
  .then(function(obj){ // table created, load file
    //obj.remainingChunk
    //obj.aryFieldInfo
    //obj.fieldNamesStr
    jobInfo.aryFieldInfo = obj.aryFieldInfo
    reply()
    //
    var sql = `LOAD DATA LOCAL INFILE '${paramObj.filePath}'
    INTO TABLE \`${paramObj.tblName}\`
    FIELDS TERMINATED BY ','
    ENCLOSED BY '"'
    LINES TERMINATED BY '\n'
    IGNORE 1 LINES ;
    `
    return queryHandler(sql)
  })
  .then(function(){
    log("done with 'LOAD DATA LOCAL INFILE'")
    terminate(false,"completed!")
  })
  .catch(function(err){
    jobInfo.logError(err)
    terminate(true,"error")
    reject(err)
  })
  function terminate(forcedTermination,msg){
    if(jobInfo.completed)
      return
    log("terminate: "+ msg)
    jobInfo.forcedTermination = forcedTermination
    jobInfo.terminateMsg = msg
    jobInfo.setComplete();
    jobInfo.updateTimeElasped()
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
    readWriteStreamHandler.close();
    queryHandler = null;
    readWriteStreamHandler = null;
  }
  function log(str){
    if(paramObj.allowLog)
      console.log("importFileByPath: " + str)
  }

}
