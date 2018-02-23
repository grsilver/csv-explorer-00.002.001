
// https://medium.freecodecamp.org/node-js-streams-everything-you-need-to-know-c9141306be93
// https://stackoverflow.com/questions/6156501/read-a-file-one-line-at-a-time-in-node-js
//https://techsparx.com/nodejs/howto/csv2mysql.html
const path = require('path');
const fs         = require('fs');
const readline = require('readline')
const stream = require('stream')
const config = require('../../ssd-explorer.config.js');
//const { Readable } = require('stream'); // same as const Readable = require('stream').Readable?; https://medium.com/the-node-js-collection/an-update-on-es6-modules-in-node-js-42c958b890c


module.exports = readCsvFileLine;

const appDir = path.normalize(path.dirname(require.main.filename )+"/../")

//console.log("readCsvFileLine: appDir: "+ appDir)
const defaultDirectoryRoot =  config.readCsvLine.defaultDirectoryRoot

/**
 * Read a file.
 * @param {Object} paramObj - The employee who is responsible for the project.
 * @param {Requester~requestCallback} paramObj.onLine called on every line.
 * @param {number} paramObj.limit - // number of lines
 * @param {string} paramObj.filePath - // if start with "/" then root. else
 * @param {boolean} paramObj.resolveLines - // if true, will an array of lines to promise resolve
 * @return {Promise}
 * http://usejsdoc.org/tags-param.html
 */
/**
 * This callback is displayed as part of the Requester class.
 * @callback Requester~requestCallback
 * @param {string} line
 * @param {number} count
 * @param {bool} last
 * @param {function} functionBreak
 */
function readCsvFileLine(paramObj){
  return new Promise(function(resolve,reject){

    var fullFilePath = (function(filePath){
        //return  "/mnt/c/dev/SSDQuery/v.00.002.001/import_cache"
        //console.log("readCsvFileLine: filePath: "+ filePath)
        if(!filePath || filePath===""){
          return false
        }
        if(filePath.indexOf("/")==0){
          return filePath
        }
        if(defaultDirectoryRoot.indexOf("/")==0){
          filePath =  defaultDirectoryRoot + "/" + filePath;
        }
        else{
          filePath =  appDir + "/" + defaultDirectoryRoot + "/" + filePath;
        }
        return s = path.normalize(filePath)
      })(paramObj.filePath)

    //console.log("readCsvFileLine: fullFilePath: "+ fullFilePath)

    if(!fullFilePath){
      return reject({message:"bad fullFilePath:"+fullFilePath})
    }
    if(! fs.existsSync(fullFilePath)){
      return reject({message:"path doesn't exist:"+fullFilePath})
    }

    paramObj.fullFilePath = fullFilePath

    try{
      readFile(paramObj,function(responseObj){
        resolve(responseObj)
      })
    }
    catch(err){
      reject(err)
    }
  })
}
function readFile(paramObj,callback){
  //https://nodejs.org/api/readline.html
  //https://stackoverflow.com/questions/16010915/parsing-huge-logfiles-in-node-js-read-in-line-by-line


  var instream = fs.createReadStream(paramObj.fullFilePath);
  var outstream = new stream;
  outstream.readable = true;
  //outstream.writable = true;

  var timeStart = new Date().getTime();

  var responseObj = {
    lineCount:0
  }

  if(paramObj.resolveLines){
    responseObj.lines = []
  }

  var rl = readline.createInterface({
      input: instream,
      //output: outstream,
      terminal: false
  });

  var count = 0
  /* bug with readline
  it keeps executing after rl.pause() or rl.close has been pushed through. this is because it finnished what's in the buffer. it doesn't go all the way through tho.
  https://github.com/nodejs/node-v0.x-archive/issues/8340

  */
  var boolStop = false
  rl.on('line', function(line) {
    if(boolStop){
      return
    }
    //console.log("line: "+ line)
    count++
    responseObj.lineCount++;
    if(paramObj.resolveLines){
      responseObj.lines.push(line)
    }
    if(responseObj.onLine){
      responseObj.onLine(line,count,false,stop)
    }
    if(paramObj.limit && paramObj.limit <= count){
      stop()
    }
  });
  rl.on('close', function(){
    //console.log("closed")
    var timeEnd = new Date().getTime();
    var timeEllapsed = timeEnd - timeStart
    responseObj.timeEllapsed = timeEllapsed
    callback (responseObj)
 });
  function stop(){
    //console.log("stop")
    boolStop = true;
    rl.close()
    instream.close()
    instream.destroy()
  }

}
