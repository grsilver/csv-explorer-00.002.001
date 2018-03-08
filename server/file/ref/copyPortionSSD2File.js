const ssdFileHandling_common = require("./ssdFileHandling_common.js")
const forEach = require ('../lib/forEach.js');
var fs = require('fs');
var util = require('util');
const { Readable } = require('stream');//var Readable = require('stream').Readable;
const { Transform } = require('stream');


module.exports = copyPortionSSD2File;

//https://medium.freecodecamp.org/node-js-streams-everything-you-need-to-know-c9141306be93
//https://joshondesign.com/2014/06/25/nodestreamsareawesome
//https://stackoverflow.com/questions/29013477/using-streams-in-mysql-with-node
//https://stackoverflow.com/questions/33133933/fs-createreadstream-limit-the-amount-of-data-streamed-at-a-time?rq=1 // fs.createReadStream - limit the amount of data streamed at a time
// file to buffer
/* new line

UNIX: \n - this is waht SSD uses
old Mac systems (pre-OS X), \r
Windows: \r\n

*/

/*
each chunk is ~ 130 lines


*/



const ssdLineDeliminator = "\n"

function copyPortionSSD2File(paramObj,resolve,reject){
  /*
  readableSrc
    .pipe(transformStream1)
    .pipe(transformStream2)
    .pipe(finalWrtitableDest)

    const inStream = new Readable();
    inStream.push('ABCDEFGHIJKLM');
    inStream.push('NOPQRSTUVWXYZ');
    inStream.push(null); // No more data
    inStream.pipe(process.stdout);
  */

  //paramObj.filePath = "Book1.csv"
  paramObj.filePath = "DailySessionLog_BellMedia_2018-01-17.csv"
  paramObj.filePath = ssdFileHandling_common.normalizeFilePath(paramObj.filePath)
  paramObj.destinationPath = ssdFileHandling_common.normalizeFilePath(paramObj.destinationPath)


  var limit = 5

  var returnObj = {}
  returnObj.chunkCount = 0

  //return withPipe(paramObj,returnObj,resolve,reject)
  return noPipe(paramObj,returnObj,resolve,reject)


}

function noPipe(paramObj,returnObj,resolve,reject){
  var startTime = new Date();
  var rstream = fs.createReadStream(paramObj.filePath );
  var wstream = fs.createWriteStream(paramObj.destinationPath);
  var readDone = false
  rstream.on('data',function(data) {
    rstream.pause();
    returnObj.chunkCount++
    wstream.write(data);
    //console.log("onData")
    rstream.resume()
  });
  rstream.on('close', function(d) {
    readDone = true
    console.log("rstream close: "+d)
    stop()
  });
  wstream.on('finish', (d) => {
    console.log("wstream finish:"+d)
    resolve(returnObj)
  });

  function stop(){
    //rstream.pause();
    //rstream.resume()
    var endtime = new Date();
    returnObj.msecsElasped = endtime - startTime
    //rstream.close()
    wstream.end(); // can add last line as a param?
  }
}

function withPipe(paramObj,returnObj,resolve,reject){
  var startTime = new Date();
  //var numOfFullLines = data.match(/\n/g).length

  var readDone = false

  var rstream = fs.createReadStream(paramObj.filePath );
  var wstream = fs.createWriteStream(paramObj.destinationPath);

  wstream.on('finish', () => {
    var endtime = new Date();
    var msecsElasped = endtime - startTime
    console.log("wstream: "+ msecsElasped)
  });
  rstream.on('finish', () => {
    var endtime = new Date();
    var msecsElasped = endtime - startTime
    console.log("rstream: "+ msecsElasped)
    //returnObj.msecsElasped = msecsElasped
    //resolve(returnObj)
  });

  rstream.pipe(wstream)
}
