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
const listAllTagNames = require('./listAllTagNames.js')

module.exports = importFileByPath_viaChucks;

//insert method: msecsElapsed:    218542  (3.64 min)
//load data method: msecsElapsed: 204534  (3.4)

const _aryFields_communityDocs = [{name:"clientId",fieldType:"VARCHAR(15)"},{name:"ssd_date",fieldType:"VARCHAR(15)"}]

function importFileByPath_viaChucks(paramObj){
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

  //var readDone = false // set in onReadStreamClose()
  var _readWriteStreamHandler// set in nested getQueryHandler.then()
  var _leftOverFromLastChunk; // set in nested function trim_store_and_carryOver_last_incomplete_line()
  var _queryHandler;// set in getQueryHandler().then()
  var _mSecsTimeOut_replyWithIncompleteJob = 3000
  var _replied = false
  var _firstLineParsed = false

  var _colNum_tags;
  var _colNum_convivasessionid;
  var _colNum_ssd_date;
  var _colNum_clientId;
  var _aryFields_tags
  var _aryFields_fromCSV
  var _lastSql


  var _ssd_date = (function(){
    var s = paramObj.filePath
    var iDash = s.lastIndexOf("_")
    if(iDash == -1)
      return ""
    var s = s.substring(iDash+1)
    var iDot = s.lastIndexOf(".")
    s = s.substring(0,iDot)
    return s
  })()
  console.log("importFileByPath_viaChucks: _ssd_date: "+ _ssd_date)

  // replyObj
  var jobInfo = jobManager
    .getNewJob()
    .setTerminateFunction(function(){
      terminate(true,"terminated via jobInfo")
    })
    .setJobType("importFileByPath_via_streamChunksAndInsertSql")
  //jobInfo.tableExisted= false
  jobInfo.chunkCount = 0
  jobInfo.lineCount = 0
  jobInfo.insertedChunkCount = 0
  jobInfo.forcedTermination = false
  jobInfo.cleanedUp = false  //
  jobInfo.insertErrorLimitReached  =  false  //
  jobInfo.aryFieldInfo =  null
  jobInfo.repliedWithIncompleteJob = false

  paramObj.filePath = ssd_file_utils.normalizeFilePath(paramObj.filePath)

  // frist get a db connection wrapped in a promise (_queryHandler), then start to read / insert (cr8ReadWritePipe)
  getQueryHandler()
  .then(function(qHandler){
    _queryHandler = qHandler
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
    if(_replied)
      return
    _replied = true
    log("replying with jobInfo of ongoing job: "+ jobInfo.jobID)
    resolve(jobInfo)
  }
  function cleanUp(){
    if(jobInfo.cleanedUp)
      return
    log("cleanUp");
    jobInfo.cleanedUp = true
    _queryHandler.end()
    readWriteStreamHandler.close();
    _queryHandler = null;
    readWriteStreamHandler = null;
  }
  function onWriteStreamChunk(chunk,encoding,callback_writeChunkDone){


    if(jobInfo.cleanedUp)
      return
    jobInfo.chunkCount++
    //log("onWriteStreamChunk: "+ jobInfo.chunkCount)
    jobInfo.updateTimeElasped()

    if(jobInfo.msecsElapsed >= _mSecsTimeOut_replyWithIncompleteJob){
      jobInfo.repliedWithIncompleteJob = true;
      reply()
    }
    var strChunk = chunk.toString()
    parseFirstLine(strChunk)
    .then(function(possiblyModifiedChunk){
      return insertChunk(possiblyModifiedChunk)
    })
    .then(function(){
      callback_writeChunkDone()
    })
    .catch(function(err){
      log("onWriteStreamChunk: err: "+ err)
      log("onWriteStreamChunk: _lastSql:\n"+ _lastSql)

      jobInfo.errorCount++;
      jobInfo.lastError = err
      if(jobInfo.chunkCount == 1){
        log("-error on 1st chunk, breaking")
        terminate(true,"error on 1st chunk")
        throw err
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

  function parseFirstLine(strChunk){

    var remainingChunk

    return new Promise(function(resolve,reject){
      if(_firstLineParsed){
        resolve(strChunk)
        return
      }
      _firstLineParsed = true
      log("parseFirstLine")

      listAllTagNames(paramObj)
      .then(function(response_listAllTagNames){

        _aryFields_tags = parseResponseByListAllTagsNames(response_listAllTagNames)

        strChunk = strChunk.toString();
        var iLineBrk = strChunk.indexOf("\n")
        var headerLine = strChunk.substring(0,iLineBrk);
        remainingChunk = strChunk.substring(iLineBrk+1)



        // cr8 table if doesn't exist
        _aryFields_fromCSV = ssd_file_utils.parseHeaderLine(headerLine)

        jobInfo.aryFieldInfo =  _aryFields_fromCSV.slice()
        jobInfo.aryFieldInfo = jobInfo.aryFieldInfo.concat(_aryFields_communityDocs)
        jobInfo.aryFieldInfo = jobInfo.aryFieldInfo.concat(_aryFields_tags)



        log("parseFirstLine: aryFieldInfo: "+ jobInfo.aryFieldInfo.map(function(fieldInfo) { return fieldInfo.name +"|" +fieldInfo.fieldType;}).toString())

        forEach(jobInfo.aryFieldInfo,function(fieldInfo,i,brk){
          if(fieldInfo.name == "sessiontags"){
            _colNum_tags = i
          }
          if(fieldInfo.name == "convivasessionid"){
            _colNum_convivasessionid = i
          }
          if(fieldInfo.name == "clientId"){
            _colNum_clientId = i
          }
          if(fieldInfo.name == "ssd_date"){
            _colNum_ssd_date = i
          }

        })


        return cr8Table({
          _queryHandler:_queryHandler
          ,tblName:paramObj.tblName
          ,primaryKey:ssd_file_utils.getPrimaryKey()
          ,aryFieldInfo:jobInfo.aryFieldInfo
          ,ignoreIfExists:true
        })
      })
      .then(()=>{ // table existed or has been created,
        log("table created")
        resolve(remainingChunk)
      })
      .catch(reject)
    })
  }
  //insert write stream chunk into database
  function insertChunk(strChunk){
    return new Promise((resolve,reject)=>{
      strChunk = trim_store_and_carryOver_last_incomplete_line(strChunk);
      var strRecordS = parseChunk(strChunk)
      var sql = getSql2InsertChunk(strRecordS)
      _lastSql = sql
      //log("\n-chunk #: "+jobInfo.chunkCount+". sql: \n"+sql)
      _queryHandler(sql)
      .then(function(rows){
        jobInfo.insertedChunkCount++
        //log("\n-query success!, insertedChunkCount: "+ jobInfo.insertedChunkCount)
        _lastSql = null
        resolve()
      })
      .catch(reject)
    })
  }
  function parseChunk(strChunk){
    //jobInfo.lineCount += strChunk.match(/\n/g).length;
    var aryLines = strChunk.split("\n")
    var strRecordS = ""
    var delim =
    forEach(aryLines,function(line,lineCount){
      if(!line || line == "")
        return

      var aryCsvValues = line.split('","')

      if(aryCsvValues.length < _aryFields_fromCSV.length)
        return;

      if(lineCount!=0){
        strRecordS += "\n,"
      }

      strRecordS +=  "(" + parseLine(line,aryCsvValues) + ")"
    })
    //values = values.replace(/"\n/g,'")\n,(')
    //values = "("+values

    return strRecordS
  }
  function parseLine(line,aryCsvValues){
    jobInfo.lineCount ++;


    var strReturnLine = ""
    var tagsObj = {}

    addClientID()
    add_ssd_date()
    populateTagsObj()
    forEach(_aryFields_tags,function(fieldInfo){
      var val = tagsObj[fieldInfo.name] || ""
      line += ',"' +val+'"'
    })

    return line

    function add_ssd_date(){
      line += ',"' +_ssd_date+'"'
    }
    function addClientID(){
      var convivasessionid = aryCsvValues[_colNum_convivasessionid]
      if(!convivasessionid){
        line += ',""'
        jobInfo.foundRecordWithNoClientID = jobInfo.lineCount;
        //log("foundRecordWithNoClientID:"+ jobInfo.lineCount)
        return
      }

      //8025681:1708681910:125006299:1630859473:4109428019
      // where everything up to the last : is clientId
      var iColon = convivasessionid.lastIndexOf(":");
      var clientID = convivasessionid.substring(0,iColon)
      line += ',"' +clientID+'"'
    }

    function populateTagsObj(){ // populate tagsObj
      var obj = {}
      var strTags = aryCsvValues[_colNum_tags];
      if(!strTags || strTags == "")
        return
      var aryKeyValStrings = strTags.split("&")
      forEach(aryKeyValStrings,function(keyValStr){
        var aryKeyVal = keyValStr.split("=");
        var tagKey_raw = aryKeyVal[0]
        var tagVal = aryKeyVal[1]
        var tagKey = ssd_file_utils.convertToProperDBFieldName(tagKey_raw)
        tagsObj[tagKey] = tagVal
      })
    }

  }

  function getSql2InsertChunk(strRecordS){
    /*
    `INSERT INTO ${paramObj.tblName}
    (${fieldNames})
    VALUES
    (1,2,3),
    (4,5,6),
    (7,8,9);`

    */

    var fieldNames = jobInfo.aryFieldInfo.map(function(fieldInfo) { return fieldInfo.name;}).toString();

    //values = values.substring(0,values.length - 3) // take off last ")"
    var sql = `INSERT INTO ${paramObj.tblName}
    (${fieldNames})
    VALUES
    ${strRecordS};`
    return sql
  }
  // sometimes the chunk breaks off with an incomplete line, we must save it and carry it over for the next chunk
  function trim_store_and_carryOver_last_incomplete_line(strChunk){
    _leftOverFromLastChunk = _leftOverFromLastChunk || ""
    strChunk = _leftOverFromLastChunk + strChunk;
    _leftOverFromLastChunk = "";
    if(strChunk.endsWith("\n"))
      return strChunk;
    var iLineBrk = strChunk.lastIndexOf("\n")
    _leftOverFromLastChunk = strChunk.substring(iLineBrk+1);
    strChunk = strChunk.substring(0,iLineBrk+1);
    return strChunk;
  }
  function log(str){
    if(paramObj.allowLog)
      console.log("importFileByPath: " + str)
  }
}

function parseResponseByListAllTagsNames(res){
  var tagHolder = res.tagHolder
  var ary = []
  forEach(tagHolder,function(tagInfo){
    ary.push({
      name:tagInfo.db_friendly_field_name
      ,fieldType:"VARCHAR(255)"
    })
  })
  return ary
}
