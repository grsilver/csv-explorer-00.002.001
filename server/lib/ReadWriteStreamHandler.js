var fs = require('fs');
var util = require('util');
const { Readable } = require('stream');//var Readable = require('stream').Readable;
const { Transform } = require('stream');
const { Writable } = require('stream');

module.exports = ReadWriteStreamHandler;

function ReadWriteStreamHandler(extendableObject){


  var t = extendableObject || this;
  t.addListener_chunkReady2Write = addListener_chunkReady2Write;// (chunk,encoding,callback_writeChunkDone)
  t.close = close
  t.begin = begin
  t.setFilePath = setFilePath
  t.allowLog = allowLog
  t.setChunkLimit = setChunkLimit

  //rstream.pause();
  //rstream.resume()

  var _onWriteChunk;
  var _onDone;
  var _filePath
  var _wstream
  var _rstream
  var _resolve
  var _reject
  var _logAllowed
  var _logPrefix
  var _closed
  var _chunkCount = 0
  var _chunkLimit
  var _lastChunk

  function setFilePath(filePath){
    _filePath = filePath
    return t
  }
  function setChunkLimit(limit){
    _chunkLimit = limit
    return t
  }

  function begin(){
    log("begin")
    return new Promise(function(resolve,reject){
      _resolve = resolve
      _reject = reject
      try{
        setUpReadWritePipe()
      }
      catch(err){
        log("err: "+ err.toString())
        reject(err)
      }

    })
  }
  function setUpReadWritePipe(){
    log("setUpReadWritePipe: filePath: "+ _filePath)
    _rstream = fs.createReadStream(_filePath );
    _wstream = new Writable({
      write(chunk, encoding, callback_writeChunkDone) {
        onWriteChunk(chunk, encoding, callback_writeChunkDone)
      }
    });
    _wstream.on('finish', onWriteStreamFinish);
    _rstream.on('close', onReadStreamClose);
    _rstream.pipe(_wstream);
  }
  function allowLog(boolYesNo,prefix){
    _logAllowed = boolYesNo
    _logPrefix = prefix || ""
    return t;
  }
  function close(){
    if(_closed)
      return
    _closed = true
    log("close")
    try{
      _rstream.close()
    }
    catch(err){
      log("close: can't close rstream")
    }
    try{
      _wstream.end()
    }
    catch(err){
      log("close: can't end wstream")
    }
    delete _rstream
    delete _wstream
    var obj = {
      chunkCount: _chunkCount
      ,lastChunk: _lastChunk
      ,chunkLimit: _chunkLimit
    }
    _resolve(obj)
  }
  function addListener_chunkReady2Write(onChunk){
    _onWriteChunk = onChunk
    return t;
  }
  function onWriteStreamFinish(){
    log("onWriteStreamFinish")
    close()
  }
  function onWriteChunk(chunk, encoding, callback_writeChunkDone){
    log("onWriteChunk")
    _lastChunk = chunk
    _chunkCount++
    if(_onWriteChunk)
      _onWriteChunk(chunk,encoding,callback_writeChunkDone)
    if(_chunkLimit && _chunkCount >= _chunkLimit ){
      close()
    }
  }
  function onReadStreamClose(){
    log("rstream close")
  }
  function log(str){
    if(_logAllowed){
      str = "ReadWriteStreamHandler. " + str
      if(_logPrefix){
        str = _logPrefix + ". " + str
      }
      console.log(str)
    }
  }

}
