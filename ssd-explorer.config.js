module.exports = {
  version: "00.002.001"
  ,database: {
    host: '127.0.0.1'
    ,user: 'root'
    ,password: 'password'
    ,database: 'convivaSSD'
  }
  ,readCsvLine:{
    defaultDirectoryRoot:"./import_cache"
  }
  ,registeredMethods :[
    {
      requestPath : "ssdFileHandling.getLineCount"
      ,filePath:"ssdFileHandling/ssdFileHandlingAPI.js"
      ,methodName:"getLineCount"
      ,description:"description1 description1"
      ,access : ["tier2"]
      ,params : [
        {name:"filePath",defaultValue:"Book1.csv"}
      ]
      ,returnType:"OBJECT"
      ,implemented:"100"
    }
    ,{
      requestPath : "ssdFileHandling.getMainColumnNames"
      ,filePath:"ssdFileHandling/ssdFileHandlingAPI.js"
      ,methodName:"getMainColumnNames"
      ,description:"looks at file and sends back MAIN column names"
      ,access : ["tier2"]
      ,params : [
        {name:"filePath",defaultValue:"Book1.csv"}
      ]
      ,returnType:"OBJECT_ARRAY"
      ,implemented:"100"
    }
    ,{
      requestPath : "ssdFileHandling.cr8TableForSSDImport"
      ,filePath:"ssdFileHandling/ssdFileHandlingAPI.js"
      ,methodName:"cr8TableForSSDImport"
      ,description:"cr8's a table with fields from SSD"
      ,access : ["tier2"]
      ,params : [
        {name:"tblName",defaultValue:"ssd2018_02_22_001"}
        ,{name:"filePath",defaultValue:"Book1.csv"}
      ]
      ,returnType:"BOOLEAN"
      ,implemented:"50"
    }
    ,{
      requestPath : "listMethods"
      ,filePath:"listMethods.js"
      ,methodName: null
      ,description:"description1 description1"
      ,access : ["everyone","tier1","tier2"]
      ,params : [
        {name:"access",defaultValue:"ALL"}
      ]
      ,returnType:"ARRAY"
      ,implemented:"100"
    }
    ,{
      requestPath : "about"
      ,filePath:"about.js"
      ,methodName:null
      ,description:"description2 description2"
      ,access : ["everyone","tier1","tier2"]
      ,params : [
      ]
      ,returnType:"OBJECT"
      ,implemented:"100"
    }
    ,{
      requestPath : "query"
      ,filePath:"query/queryAPI.js"
      ,methodName:"query"
      ,description:"an open ended query call. Default: list frist 5 rows"
      ,access : ["tier2"]
      ,params : [
        {name:"sql",defaultValue:"SELECT * FROM SSD1 LIMIT 5"}
      ]
      ,returnType:"OBJECT_ARRAY"
      ,implemented:"90"
    }
    ,{
      requestPath : "getDataBaseSize"
      ,filePath:"query/queryAPI.js"
      ,methodName:"getDataBaseSize"
      ,description:"Get Size Of DB"
      ,access : ["tier2"]
      ,returnType:"OBJECT_ARRAY"
      ,implemented:"80"
    }
  ]
};
