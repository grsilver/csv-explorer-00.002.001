module.exports = {
  version: "00.002.001"
  ,port:8082
  ,database: {
    host: '127.0.0.1'
    ,user: 'root'
    ,password: 'password'
    ,database: 'convivaSSD'
  }
  ,tblPrimaryKey : "conviva_session_id"
  ,readCsvLine:{
    defaultDirectoryRoot:"./import_cache"
  }
  ,registeredMethods :[
    {requestPath : "file.getLineCount"
      ,filePath:"file/getLineCount.js"
      ,methodName:null
      ,description:"get the total line count of a file"
      ,access : ["tier2"]
      ,params : [
        {name:"filePath",defaultValue:"Book1.csv"}
      ]
      ,returnType:"OBJECT"
      ,implemented:"100"
    }
    ,{requestPath : "file.getMainColumnNames"
      ,filePath:"file/getMainColumnNames.js"
      ,methodName:null
      ,description:"looks at file and sends back MAIN column names"
      ,access : ["tier2"]
      ,params : [
        {name:"filePath",defaultValue:"Book1.csv"}
      ]
      ,returnType:"OBJECT_ARRAY"
      ,implemented:"100"
    }
    ,{requestPath : "file.listAllTagNames"
      ,filePath:"file/listAllTagNames.js"
      ,methodName:null
      ,description:`List All Tags in SSD's "column session tags"`
      ,access : ["tier2"]
      ,params : [
        {name:"filePath",defaultValue:"Book1.csv"}
      ]
      ,returnType:"OBJECT"
      ,implemented:"50"
    }
    ,{requestPath : "file.importFileByPath"
      ,filePath:"file/importFileByPath.js"
      ,methodName:null
      ,description:`copies an SSD into a table in streaming chunks`
      ,access : ["tier2"]
      ,params : [
        {name:"tblName",defaultValue:"ssd2"}
        ,{name:"filePath",defaultValue:"DailySessionLog_BellMedia_2018-01-17.csv"}
      ]
      ,returnType:"OBJECT"
      ,implemented:"50"
    }
    ,{requestPath : "file.importFileByPath.getJobInfoByID"
      ,filePath:"file/importFileByPath.js"
      ,methodName:"getJobInfoByID"
      ,description:`gets info of running job`
      ,access : ["tier2"]
      ,params : [
        {name:"jobID",defaultValue:""}
      ]
      ,returnType:"OBJECT"
      ,implemented:"50"
    }
    ,{requestPath : "file.importFileByPath.terminateJobByID"
      ,filePath:"file/importFileByPath.js"
      ,methodName:"terminateJobByID"
      ,description:`terminates a running job`
      ,access : ["tier2"]
      ,params : [
        {name:"jobID",defaultValue:""}
      ]
      ,returnType:"OBJECT"
      ,implemented:"50"
    }
    ,{requestPath : "file.copyPortionSSD2File"
      ,filePath:"file/copyPortionSSD2File.js"
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
    ,{requestPath : "db.query"
      ,filePath:"db/query.js"
      ,methodName:"query_api"
      ,description:"an open ended query call. Default: list frist 5 rows"
      ,access : ["tier2"]
      ,params : [
        {name:"sql",defaultValue:"SELECT * FROM SSD1 LIMIT 5"}
      ]
      ,returnType:"OBJECT_ARRAY"
      ,implemented:"90"
    }
    ,{requestPath : "db.deleteTable"
      ,filePath:"db/deleteTable.js"
      ,methodName:null
      ,description:"deletes a tbl by name"
      ,access : ["tier2"]
      ,params : [
        {name:"tblName",defaultValue:"tblName"}
      ]
      ,returnType:"OBJECT"
      ,implemented:"90"
    }
    ,{requestPath : "db.listTables"
      ,filePath:"db/listTables.js"
      ,methodName:null
      ,description:"List all tables and their size"
      ,access : ["tier2"]
      ,returnType:"OBJECT_ARRAY"
      ,implemented:"80"
    }
  ]
};
