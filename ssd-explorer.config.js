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
      ,filePath:"ssdFileHandling/main.js"
      ,methodName:"getLineCount"
      ,description:"description1 description1"
      ,access : ["tier2"]
      ,params : [
        {name:"filePath",defaultValue:"Book1.csv"}
      ]
      ,returnType:"OBJECT"
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
      ,returnType:"OBJECT_ARRAY"
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
      ,filePath:"query/main.js"
      ,methodName:"apiQuery"
      ,description:"an open ended query call. Default: list frist 5 rows"
      ,access : ["tier2"]
      ,params : [
        {name:"sql",defaultValue:"SELECT * FROM SSD1 LIMIT 5"}
      ]
      ,returnType:"OBJECT_ARRAY"
      ,implemented:"80"
    }
  ]
};
