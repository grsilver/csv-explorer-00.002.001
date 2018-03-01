const ssdFileHandling_common = require("./ssdFileHandling_common.js")
const forEach = require ('../lib/forEach.js');
var fs = require('fs');
var util = require('util');
const { Readable } = require('stream');//var Readable = require('stream').Readable;
const { Transform } = require('stream');
const { Writable } = require('stream');
const mysql = require('mysql');
const config = require('../../ssd-explorer.config.js');

module.exports = importSSDbyStreamChunks;


const ssdLineDeliminator = "\n"

function importSSDbyStreamChunks(paramObj,resolve,reject){
  /*
  */

  //paramObj.filePath = "Book1.csv"
  paramObj.filePath = "copy.copy.csv"
  paramObj.filePath = ssdFileHandling_common.normalizeFilePath(paramObj.filePath)
  //paramObj.tblName;


  var limit = 5

  var returnObj = {
    errorCount:0
    ,insertedCount:0
  }
  var chunkCount = 0
  var readDone = false
  var startTime = new Date();
  var colStr;
  var connection = mysql.createConnection({
    host: config.database.host,
    user: config.database.user,
    //password: 'password',
    database: config.database.database
  });
  var rstream = fs.createReadStream(paramObj.filePath );
  var leftOverFromLastChunk = ""
  var wstream = new Writable({
    write(chunk, encoding, callback) {
      //rstream.pause();
      //rstream.resume()
      chunkCount++
      var strChunk = chunk.toString()
      strChunk = leftOverFromLastChunk + strChunk;
      if(chunkCount == 1)strChunk = cr8ColStr(strChunk)
      strChunk = trimUnfinishedLine(strChunk);
      var sql = getSql(strChunk)
      // -----------------------------TEMP
      console.log("\n\n\n-sql: "+sql)
      // -----------------------------TEMP
      connection.query(sql,(err,rows) => {
        if(err){
          console.log("\n\n\n-err: "+err.toString())
          endConnection()
          returnObj.errorCount++
          returnObj.lastError = err
          wstream.end();
        }
        else{
          returnObj.insertedCount++
          callback()
        }
      });
      // -----------------------------TEMP
      wstream.end();
      // -----------------------------TEMP
    }
  });
  function getSql(strChunk){
    /*
    `INSERT INTO ${paramObj.tblName}
    (${colStr})
    VALUES
    (1,2,3),
    (4,5,6),
    (7,8,9);`

    */
    var values = strChunk
    values = values.replace(/"\n/g,'")\n(')
    values = "("+values
    values = values.substring(0,values.length - 1) // take off last ")"
    var sql = `INSERT INTO ${paramObj.tblName}
    (${colStr})
    VALUES
    ${values};`
    return sql
  }
  function cr8ColStr(strChunk){
    var iLineBrk = strChunk.indexOf("\n")
    colStr = strChunk.substring(0,iLineBrk);
    var colStrAry = colStr.split(",")
    var colName
    var ary2 = []
    for(var i =0;i<colStrAry.length;i++){
      colName = colStrAry[i]
      colName = ssdFileHandling_common.convertToProperDBFieldName(colName);
      colName = `"${colName}"`;
      ary2.push(colName)
    }
    colStr = ary2.toString();
    return strChunk.substring(iLineBrk+1);
  }
  function trimUnfinishedLine(strChunk){
    leftOverFromLastChunk = "";
    if(strChunk.endsWith("\n"))
      return strChunk;
    var iLineBrk = strChunk.lastIndexOf("\n")
    var leftOverFromLastChunk = strChunk.substring(iLineBrk+1);
    strChunk = strChunk.substring(0,iLineBrk+1);
    return strChunk;
  }
  rstream.on('close', function(d) {
    readDone = true
    console.log("rstream close")
  });
  wstream.on('finish', () => {
    endConnection()
    var endtime = new Date();
    returnObj.msecsElasped = endtime - startTime;
    console.log("wstream finish")
    try{
      rstream.close()
    }
    catch(err){
      console.log("wstream finish: can't close rstream")
    }
    if(returnObj.errorCount){
      reject(returnObj);
    }
    else{
      resolve(returnObj)
    }

  });
  rstream.pipe(wstream)
  function endConnection(){
    if(connection)
      connection.end()
    connection = null;
  }
  function getInsertLineSql(line){
    line = line.replace(/'/g, "\\'");
    line = `'${line}'`
    line = line.replace(/,/g, "','");
    var values = lines
    var sql = `INSERT INTO ${tblName} (${strInsertColumnsSubSql}) VALUES(${values});`
    return sql;
  }

}
