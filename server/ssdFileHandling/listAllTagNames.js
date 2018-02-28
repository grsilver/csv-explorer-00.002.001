const readCsvFileLine = require("./readCsvFileLine.js")
const forEach = require ('../lib/forEach.js');
const fieldNameUtils = require ('./fieldNameUtils.js');
module.exports = listAllTagNames;



function listAllTagNames(paramObj,resolve,reject){
  paramObj.filePath = paramObj.filePath
  //paramObj.endLineNum = 10;
  paramObj.onLine = onLine;

  var tagHolder = {}

  readCsvFileLine(paramObj)
  .then(function(readCsvFileLine_returnObj){
    readCsvFileLine_returnObj.tagHolder = tagHolder
    resolve(readCsvFileLine_returnObj)
  })
  .catch(function(err){
    //console.log("ddddd")
    //throw err
    reject(err)
  })

  var colNameTags = "session tags"
  var tagColNum,aryColumns,tagStr,tagAry,aryNmVal,tagName,tagVal
  function onLine(line,lineCount,functionBreak,throwError){
    try{
      onLineTry(line,lineCount,functionBreak,throwError)
    }
    catch(err){
      functionBreak()
      reject(err)
    }
  }

  function onLineTry(line,lineCount){
    //console.log("onLineTry:"+ lineCount + ", line: "+ line)
    aryColumns = line.split(",");
    if(lineCount==0){
      tagColNum = forEach(aryColumns,function(colName,colCount,fnBreak){
        colName = colName.replace(/["]+/g, '') // remove quotes: "viewerId","asset","device/os","country","state","city","asn","isp","start time (unix time)","startup time (ms)","playing time (ms)","buffering time (ms)","interrupts","average bitrate (kbps)","startup error","session tags","ip address","cdn","browser","conviva session id","stream url","error list","percentage complete"
        if(colName==colNameTags){
          fnBreak(colCount)
        }
      })
      if(!tagColNum){
        //functionBreak();
        console.log("onLineTry: !tagColNum")
        throw {message:`can't find session tags col : ${colNameTags}`}
      }

    }
    else{
      tagVal = aryColumns[tagColNum];
      if(!tagVal || tagVal.indexOf("=")<1)
        return
      tagVal = tagVal.replace(/["]+/g, '') //
      tagAry = tagVal.split("&")
      forEach(tagAry,function(nmValStr,colCount,fnBreak){
        if(nmValStr.indexOf("=")<1)
          return;
        aryNmVal = nmValStr.split("=")
        tagName = aryNmVal[0];
        tagVal = aryNmVal[1];
        if(tagHolder[tagName]== null){
          tagHolder[tagName] = {
            count:0
            ,examples : []
            ,db_friendly_field_name: fieldNameUtils.convertToProperDBFieldName(tagName)
          }
        }
        tagHolder[tagName].count++
        if(tagHolder[tagName].examples.length <5)
          tagHolder[tagName].examples.push(tagVal)

      })
    }
  }
}
