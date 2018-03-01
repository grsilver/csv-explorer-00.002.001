module.exports = {
  version: "00.002.001"
  ,port:8081
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
    {requestPath : "ssdFileHandling.getLineCount"
      ,filePath:"ssdFileHandling/getLineCount.js"
      ,methodName:null
      ,description:"get the total line count of a file"
      ,access : ["tier2"]
      ,params : [
        {name:"filePath",defaultValue:"Book1.csv"}
      ]
      ,returnType:"OBJECT"
      ,implemented:"100"
    }
    ,{requestPath : "ssdFileHandling.getMainColumnNames"
      ,filePath:"ssdFileHandling/getMainColumnNames.js"
      ,methodName:null
      ,description:"looks at file and sends back MAIN column names"
      ,access : ["tier2"]
      ,params : [
        {name:"filePath",defaultValue:"Book1.csv"}
      ]
      ,returnType:"OBJECT_ARRAY"
      ,implemented:"100"
    }
    ,{requestPath : "ssdFileHandling.cr8TableForSSDImport"
      ,filePath:"ssdFileHandling/cr8TableForSSDImport.js"
      ,methodName:null
      ,description:"cr8's a table with fields from SSD"
      ,access : ["tier2"]
      ,params : [
        {name:"tblName",defaultValue:"ssd2018_02_22_001"}
        ,{name:"filePath",defaultValue:"Book1.csv"}
      ]
      ,returnType:"OBJECT_ARRAY"
      ,implemented:"50"
    }
    ,{requestPath : "ssdFileHandling.listAllTagNames"
      ,filePath:"ssdFileHandling/listAllTagNames.js"
      ,methodName:null
      ,description:`List All Tags in SSD's "column session tags"`
      ,access : ["tier2"]
      ,params : [
        {name:"filePath",defaultValue:"Book1.csv"}
      ]
      ,returnType:"OBJECT"
      ,implemented:"50"
    }
    ,{requestPath : "ssdFileHandling.importSSDLineByLine"
      ,filePath:"ssdFileHandling/importSSDLineByLine.js"
      ,methodName:null
      ,description:`imports csv into existing table`
      ,access : ["tier2"]
      ,params : [
        {name:"tblName",defaultValue:"ssd2018_02_22_001"}
        ,{name:"filePath",defaultValue:"Book1.csv"}
      ]
      ,returnType:"OBJECT"
      ,implemented:"50"
    }
    ,{requestPath : "ssdFileHandling.importSSDbyStreamChunks"
      ,filePath:"ssdFileHandling/importSSDbyStreamChunks.js"
      ,methodName:null
      ,description:`copies an SSD into a table in streaming chunks`
      ,access : ["tier2"]
      ,params : [
        {name:"tblName",defaultValue:"ssd2018_02_22_001"}
        ,{name:"filePath",defaultValue:"Book1.csv"}
      ]
      ,returnType:"OBJECT"
      ,implemented:"50"
    }
    ,{requestPath : "ssdFileHandling.copyPortionSSD2File"
      ,filePath:"ssdFileHandling/copyPortionSSD2File.js"
      ,methodName:null
      ,description:`copies a portion of an SSD to another file`
      ,access : ["tier2"]
      ,params : [
        {name:"filePath",defaultValue:"DailySessionLog_BellMedia_2018-01-17.csv"}
        ,{name:"destinationPath",defaultValue:"copy.csv"}
        ,{name:"startLineNum",defaultValue:"0"}
        ,{name:"endLineNum",defaultValue:"10"}
      ]
      ,returnType:"OBJECT"
      ,implemented:"50"
    }
    ,{requestPath : "listMethods"
      ,filePath:"apiMethods/listMethods.js"
      ,methodName: null
      ,description:"description1 description1"
      ,access : ["everyone","tier1","tier2"]
      ,params : [
        {name:"access",defaultValue:"ALL"}
      ]
      ,returnType:"ARRAY"
      ,implemented:"100"
    }
    ,{requestPath : "about"
      ,filePath:"apiMethods/about.js"
      ,methodName:null
      ,description:"description2 description2"
      ,access : ["everyone","tier1","tier2"]
      ,params : [
      ]
      ,returnType:"OBJECT"
      ,implemented:"100"
    }
    ,{requestPath : "query"
      ,filePath:"query/query.js"
      ,methodName:"api_query"
      ,description:"an open ended query call. Default: list frist 5 rows"
      ,access : ["tier2"]
      ,params : [
        {name:"sql",defaultValue:"SELECT * FROM SSD1 LIMIT 5"}
      ]
      ,returnType:"OBJECT_ARRAY"
      ,implemented:"90"
    }
    ,{requestPath : "deleteTable"
      ,filePath:"query/deleteTable.js"
      ,methodName:null
      ,description:"deletes a tbl by name"
      ,access : ["tier2"]
      ,params : [
        {name:"tblName",defaultValue:"tblName"}
      ]
      ,returnType:"OBJECT"
      ,implemented:"90"
    }
    ,{requestPath : "listSizesOfTables"
      ,filePath:"query/listSizesOfTables.js"
      ,methodName:null
      ,description:"List all tables and their size"
      ,access : ["tier2"]
      ,returnType:"OBJECT_ARRAY"
      ,implemented:"80"
    }
  ]
};
