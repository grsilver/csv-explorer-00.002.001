const readCsvFileLine = require("./readCsvFileLine.js")
const forEach = require ('../lib/forEach.js');
module.exports = getMainColumnNames;

function getMainColumnNames(paramObj1){

  var paramObj2 = {}
  paramObj2.limit = 1
  paramObj2.filePath = paramObj1.filePath
  paramObj2.resolveLines = true


  return new Promise(function(resolve,reject){
    readCsvFileLine(paramObj2)
      .then(function(returnObj){

          try{
            var rows = parseLine(returnObj.lines)
            resolve(rows)
          }
          catch(err){
            reject(err)
          }
      })
      .catch(function(err){
        reject(err)
      })
  })

}

function parseLine(linesFromReadLine){
  var firstLine = linesFromReadLine[0];
  var aryColNames = firstLine.split(",");
  var aryReturn = []
  forEach(aryColNames,function(ssd_col_name){
    var planned_db_field_name = getDbProperName(ssd_col_name)
    var planned_db_type = getDbPlanned_db_type(planned_db_field_name)
    aryReturn.push({
      ssd_col_name:ssd_col_name
      ,planned_db_field_name:planned_db_field_name
      ,planned_db_type:planned_db_type
    })
  })
  return aryReturn
}

function getDbProperName(ssd_col_name){
  var planned_db_field_name = ssd_col_name.replace(/\s+/g, '_');
  planned_db_field_name = planned_db_field_name.replace(/\//g, '_');
  planned_db_field_name = planned_db_field_name.replace(/[{()}]/g, '_');
  planned_db_field_name = planned_db_field_name.replace(/__/g, '_');
  planned_db_field_name = planned_db_field_name.replace(/^_/, '') // remove _   ^ means beginning
  planned_db_field_name = planned_db_field_name.replace(/_$/, '') // remove _   $ means end
  return planned_db_field_name;
}
function getDbPlanned_db_type(planned_db_type){
  //https://stackoverflow.com/questions/219569/best-database-field-type-for-a-url

  /* http://dev.mysql.com/doc/refman/5.0/en/char.html
  Values in VARCHAR columns are variable-length strings.
  The length can be specified as a value from 0 to 255 before MySQL 5.0.3,
  and 0 to 65,535 in 5.0.3 and later versions.
  The effective maximum length of a VARCHAR in MySQL 5.0.3 and later is subject to the maximum row size
   (65,535 bytes, which is shared among all columns) and the character set used.

  */

  /* from jose
  `viewerId` varchar(255) DEFAULT NULL,
   `asset` varchar(255) DEFAULT NULL,
   `device/os` varchar(255) DEFAULT NULL,
   `country` varchar(255) DEFAULT NULL,
   `state` varchar(255) DEFAULT NULL,
   `city` varchar(255) DEFAULT NULL,
   `asn` int(11) DEFAULT NULL,
   `isp` varchar(255) DEFAULT NULL,
   `start time (unix time)` bigint(11) DEFAULT NULL,
   `startup time (ms)` int(11) DEFAULT NULL,
   `playing time (ms)` int(11) DEFAULT NULL,
   `buffering time (ms)` int(11) DEFAULT NULL,
   `interrupts` int(11) DEFAULT NULL,
   `average bitrate (kbps)` int(11) DEFAULT NULL,
   `startup error` int(11) DEFAULT NULL,
   `session tags` varchar(255) DEFAULT NULL,
   `ip address` varchar(255) DEFAULT NULL,
   `cdn` varchar(255) DEFAULT NULL,
   `browser` varchar(255) DEFAULT NULL,
   `conviva session id` varchar(255) DEFAULT NULL,
   `stream url` varchar(255) DEFAULT NULL,
   `error list` varchar(255) DEFAULT NULL,
   `percentage complete` int(11) DEFAULT NULL,
   `Connection Induced Rebuffering Time` int(11) DEFAULT NULL,
   `Video Restart Time` int(11) DEFAULT NULL,
   `Video Restart Count` int(11) DEFAULT NULL,
   `Video Playback Failure` int(11) DEFAULT NULL,
   `Video Playback Failure Error List` varchar(255) DEFAULT NULL



  */

  var type = "VARCHAR(255)"

  if(contains(planned_db_type,["asn"])){
    return  "int(11)"
  }

  if(contains(planned_db_type,[
    "time"
    ,"average_bitrate"
    ,"startup_error"
    ,"percentage"
    ,"count"
    ,"video_playback_failure"
    ,"interrupts"
  ])){
    return  "int(8)"
  }

  if(planned_db_type.indexOf("url") !=-1){
    return  "VARCHAR(255)"//2083
  }
  if(planned_db_type.indexOf("tags") !=-1){
    return  "VARCHAR(2083)"
  }

  return type;
}

function contains(planned_db_type,ary){
  planned_db_type = planned_db_type.toLowerCase();
  return forEach(ary,function(item,count,fnBreak){
    item = item.toLowerCase();
    if(planned_db_type.indexOf(item)!=-1){
      fnBreak(true)
    }
  })
}
