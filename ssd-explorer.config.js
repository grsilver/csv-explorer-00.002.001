module.exports = {
  version: "00.002.001"
  ,database: {
    host: '127.0.0.1'
    ,user: 'root'
    ,password: 'password'
    ,database: 'convivaSSD'
  }
  ,registeredMethods :[
    {
      requestPath : "importSSD.importFile"
      ,filePath:"importSSD/main.js"
      ,methodName:"apiImportFile"
      ,description:"description1 description1"
      ,access : ["tier2"]
      ,params : [
        {name:"tableName",defaultValue:"SSD1"}
        ,{name:"filePath",defaultValue:"default2"}
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
