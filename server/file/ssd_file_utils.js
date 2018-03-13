//ssdFileHandling_common
const path = require('path');
const config = require('../../ssd-explorer.config.js');
const forEach = require ('../lib/forEach.js');
const cr8Table = require('../db/cr8Table.js')

var m = module.exports = {};
m.parseHeaderLine = parseHeaderLine
m.convertToProperDBFieldName = convertToProperDBFieldName
m.proposeDbFieldTypeByName = proposeDbFieldTypeByName
m.strMatchInAry = strMatchInAry
m.normalizeFilePath = normalizeFilePath;
m.appDir = path.normalize(path.dirname(require.main.filename )+"/../")
m.defaultDirectoryRoot =  config.readCsvLine.defaultDirectoryRoot
m.getPrimaryKey = getPrimaryKey
m.cr8TableForImportFrom1stChunk = cr8TableForImportFrom1stChunk


function getPrimaryKey(){
  return config.tblPrimaryKey
}

function cr8TableForImportFrom1stChunk(tblName,queryHandler,strChunk){//paramObj.tblName
  return new Promise((resolve,reject)=>{
    strChunk = strChunk.toString();
    var iLineBrk = strChunk.indexOf("\n")
    // set fieldNames which is declared at a higher scope for multi function reference
    var headerLine = strChunk.substring(0,iLineBrk);

    // cr8 table if doesn't exist
    var aryFieldInfo = parseHeaderLine(headerLine)
    var fieldNamesStr = aryFieldInfo.map(function(fieldInfo) { return fieldInfo.name;}).toString();

    cr8Table({
      queryHandler:queryHandler
      ,tblName:tblName
      ,primaryKey:getPrimaryKey()
      ,aryFieldInfo:aryFieldInfo
      ,ignoreIfExists:true
    })
    .then(()=>{ // table existed or has been created,
      resolve({
        remainingChunk : strChunk.substring(iLineBrk+1)
        ,aryFieldInfo : aryFieldInfo
        ,fieldNamesStr:fieldNamesStr
      })
    })
    .catch(reject)
  })
}

function normalizeFilePath(requestedPath){
  //return  "/mnt/c/dev/SSDQuery/v.00.002.001/import_cache"
  //console.log("readCsvFileLine: filePath: "+ filePath)
  var filePath = requestedPath
  if(!filePath || filePath===""){
    return false
  }
  if(filePath.indexOf("/")==0){
    return filePath
  }
  if(m.defaultDirectoryRoot.indexOf("/")==0){
    filePath =  m.defaultDirectoryRoot + "/" + filePath;
  }
  else{
    filePath =  m.appDir  + "/" + m.defaultDirectoryRoot + "/" + filePath;
  }
  filePath = path.normalize(filePath)
  return filePath
}
function parseHeaderLine(firstLine){
  var aryColNames = firstLine.split(",");
  var aryReturn = []
  forEach(aryColNames,function(csv_col_name){
    var db_friendly_field_name = convertToProperDBFieldName(csv_col_name)
    var proposedFieldType = proposeDbFieldTypeByName(db_friendly_field_name)
    aryReturn.push({
      originalName:csv_col_name
      ,name:db_friendly_field_name
      ,fieldType:proposedFieldType
    })
  })
  aryReturn = aryReturn.sort(function (a, b) {
    if(a == getPrimaryKey())
      return -1
    else {
      return 0
    }
  });
  return aryReturn
}
function convertToProperDBFieldName(csv_col_name){

  var db_friendly_field_name = convert_csv_colVal_2_fieldName_by_ssd_docs_standards(csv_col_name)
  if(db_friendly_field_name)
    return db_friendly_field_name
  db_friendly_field_name = csv_col_name;
  db_friendly_field_name = db_friendly_field_name.replace(/["]+/g, '') // remove quotes:
  db_friendly_field_name = db_friendly_field_name.replace(/\s+/g, '_');
  db_friendly_field_name = db_friendly_field_name.replace(/\./g, '_');
  db_friendly_field_name = db_friendly_field_name.replace(/\//g, '_');
  db_friendly_field_name = db_friendly_field_name.replace(/[{()}]/g, '_');
  db_friendly_field_name = db_friendly_field_name.replace(/__/g, '_');
  db_friendly_field_name = db_friendly_field_name.replace(/^_/, '') // remove _   ^ means beginning
  db_friendly_field_name = db_friendly_field_name.replace(/_$/, '') // remove _   $ means end
  return db_friendly_field_name;
}
function proposeDbFieldTypeByName(name){
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

  if(strMatchInAry(name,["asn"])){
    return  "int(11)"
  }

  if(strMatchInAry(name,[
    "time"
    ,"bitrate"
    ,"startup_error"
    ,"percentage"
    ,"count"
    ,"video_playback_failure"
    ,"vpf" // according to SSD docuementation standards
    ,"interrupts"
  ])){
    return  "int(8)"
  }

  if(name.indexOf("url") !=-1){
    return  "VARCHAR(255)"//2083
  }
  if(name.indexOf("tags") !=-1){
    return  "VARCHAR(2083)"
  }

  return type;
}
function strMatchInAry(str,ary){
  name = str.toLowerCase();
  return forEach(ary,function(item,count,fnBreak){
    item = item.toLowerCase();
    if(str.indexOf(item)!=-1){
      fnBreak(true)
    }
  })
}


function convert_csv_colVal_2_fieldName_by_ssd_docs_standards(csv_col_name){
  //https://community.conviva.com/site/global/resources/ssd/index.gsp#ssd_fields
  var map = {
    "viewerId":"viewerId"
    ,"asset":"asset"
    ,"device/os":"deviceos"
    ,"country":"country"
    ,"state":"state"
    ,"city":"city"
    ,"asn":"asn"
    ,"isp":"isp"
    ,"start time (unix time)":"starttime"
    ,"startup time (ms)":"startuptime"
    ,"playing time (ms)":"playingtime"
    ,"buffering time (ms)":"bufferingtime"
    ,"interrupts":"interrupts"
    ,"average bitrate (kbps)":"averagebitrate"
    ,"startup error":"startup_error"
    ,"session tags":"sessiontags"
    ,"ip address":"ipaddress"
    ,"cdn":"cdn"
    ,"browser":"browser"
    ,"conviva session id":"convivasessionid"
    ,"stream url":"streamurl"
    ,"error list":"errorlist"
    ,"percentage complete":"percentagecomplete"
    ,"connection induced re-buffering time (ms)":"cibufferingtime"
    ,"video restart time (ms)":"vrestarttime"
    ,"re-joined count":"rejoincount"
    ,"VPF":"vpf"
    ,"VPF error list":"vpf_error_list"
  }
  return map[csv_col_name]
}
